import httpClient from "./HttpClient";
import {LocalStore} from "../utils/LocalStore";
import callApi from "../utils/fetchApi";

import md5 from "blueimp-md5";
import {Cache} from "js-cache";

let lang = {
    network: '',
    error: {
        oops: ''
    }
};

export default class JiraClient extends httpClient {
    static baseUrl = 'https://gobiz-ubox.atlassian.net/rest/api/2';

    static proxyUrl = 'https://olympus.gobizdev.com/api/Hooks/call-jira';

    static cache = new Cache();

    static flags = {};
    static REQUEST_LIMIT = 3;
    static requesting = 0;

    static REQUEST_MODE = {
        BODY_ONCE: 'body-once',
        TAKE_LATEST_BY_ENDPOINT: 'take-latest-endpoint',
        ALL: 'all'
    };

    static callback(cb, config, err, res) {
        if (config.mode === 'take-latest-endpoint') {
            let hash = md5(config.endpoint);
            if (this.flags[hash]) {
                if (this.flags[hash] > config.timestamp) {
                    //this is not latest base on endpoint, do not callback
                    console.info('request callback dismissed');
                    return
                }
            }
            this.flags[hash] = config.timestamp;
        }

        cb(err,res);
        this.doQueue();
    }

    static once(config, cb) {
        if (config.mode === 'body-once') {
            let hash = md5(config.endpoint + config.body);
            if (this.flags[hash]) {
                let error = {
                    message: 'Chỉ được post một lần thôi nhé, post nhiều lỗi đấy'
                };
                cb(error);
                return true;
            }

            this.flags[hash] = true;
            setTimeout(()=> {
                delete this.flags[hash];
            }, 10000);
        }
    }

    static request(
        requestConfig = {
            endpoint: '',
            queryString: {},
            method: 'GET',
            headers: {},
            file: "",
            body: ''
        }, token, cb)
    {
        this.addQueue(requestConfig, token, cb)
    }

    static queue = [];

    static doRequest(
        requestConfig = {
            endpoint: '',
            queryString: {},
            method: 'GET',
            headers: {},
            file: "",
            body: ''
        }, token, cb)
    {
        requestConfig = Object.assign({
            endpoint: '',
            queryString: {},
            method: 'GET',
            headers: {},
            body: '',
            token:'',
            file: "",
            mode: 'take-latest-endpoint',
            timestamp: new Date()
        }, requestConfig);

        cb = cb || (()=> {});

        let defaultLang = LocalStore.getInstance().read('language');
        defaultLang = defaultLang ? defaultLang : 'en';

        //TODO: renew token on expired

        if (token) {
            requestConfig.headers = Object.assign({}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': defaultLang,
                'Authorization': 'Basic ' + token
            }, requestConfig.headers);
        }
        else {
            requestConfig.headers = Object.assign({}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': defaultLang
            }, requestConfig.headers);
        }

        //add client-version & client-endpoint
        // let packageInfo = require('../../app.json');
        // requestConfig.headers['X-Client-Version'] = packageInfo.version;
        requestConfig.headers['X-Client-Endpoint'] = window.location;

        requestConfig.body = typeof requestConfig.body === 'object' ? JSON.stringify(requestConfig.body) : requestConfig.body;
        requestConfig.cache = requestConfig.cache || 'no-cache';

        // Trường hợp muốn upload file
        if(requestConfig.file) {
            requestConfig.body = requestConfig.file;
            delete requestConfig.headers['Content-Type'];
            delete requestConfig.headers['Accept'];
        }

        let url = '';
        if (Object.keys(requestConfig.queryString).length > 0) {
            url = requestConfig.endpoint + getQueryString(requestConfig.queryString);
        }
        else {
            url = requestConfig.endpoint;
        }

        try {
            this.requesting++;
            if (this.once(requestConfig, cb)) {
                return;
            }
            if(!navigator.onLine){
                let error={
                    code:500,
                    message:lang.network['network']
                };
                return this.callback(cb, requestConfig,error);
            }

            callApi(url, {
                method:requestConfig.method,
                headers: requestConfig.headers,
                body: requestConfig.body ? requestConfig.body : null}).then((response) => {

                this.requesting--;

                if (response && response.status === 401) {
                    this.queue = [];
                    return this.callback(cb, requestConfig, { code: 401 }, response);
                }

                return this.callback(cb, requestConfig, null, response);
            }).catch((error, response)=> {

                console.error(error, response);

                this.requesting--;
                return this.callback(cb, requestConfig,error);
            });
        } catch (error) {
            this.requesting--;
            return this.callback(cb, requestConfig,error);
        }
    }

    static addQueue(request, token, callback) {
        this.queue.push({
            request: request,
            token: token,
            callback: callback
        });

        this.doQueue()
    }

    static doQueue() {
        if (this.requesting < this.REQUEST_LIMIT && this.queue.length > 0) {
            let item = this.queue.shift();
            this.doRequest(item.request, item.token, item.callback)
        }
    }

    static async requestPromise(requestConfig, token, handleResponse = null, cache_ttl = 0) {

        let body = {
            path: requestConfig.endpoint,
            method: requestConfig.method,
            data: requestConfig.body,
            token: token
        };

        return new Promise(function(resolve, reject) {
            if (cache_ttl) {
                let data = JiraClient.cache.get(requestConfig.endpoint, null);
                if (data) {
                    return resolve({
                        status: 200,
                        body: data
                    })
                }

            }

            requestConfig.endpoint = JiraClient.proxyUrl;
            requestConfig.method = 'POST';
            requestConfig.body = body;

            JiraClient.request(requestConfig, null, (error, response)=> {
                if (error) {
                    reject(error)
                }
                else {
                    if (handleResponse) {
                        handleResponse(response)
                    }

                    if (cache_ttl) {
                        JiraClient.cache.set(requestConfig.endpoint, response.body, cache_ttl)
                    }

                    resolve(response);
                }
            });
        });
    }
}

function getQueryString(data) {
    if (data) {
        let query = '';
        for (let key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }
            if (typeof data[key] === 'object') {
                query += encodeURIComponent(key)+"="+encodeURIComponent(JSON.stringify(data[key]))+"&";
            }
            else {
                query += encodeURIComponent(key)+"="+encodeURIComponent(data[key])+"&";
            }
        }
        if(query !== ''){
            return '?' + query;
        }

        return query;
    }
}

// function parseErrors (errors) {
//     const submitErrors = {};
//     if (errors.details) {
//         const {messages} = errors.details;
//         if(messages) {
//             Object.keys(messages).map(field => {
//                 submitErrors[field] = ''//(Localize.t(messages[field][0]));
//
//                 return 0;
//             });
//         }
//     }
//
//     if (Object.keys(submitErrors).length === 0) {
//         //submitErrors['_error'] = Localize.t(errors.message)
//     }
//     return submitErrors;
// }