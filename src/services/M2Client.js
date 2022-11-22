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

export default class M2Client extends httpClient {
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
                'Authorization': 'Bearer ' + token
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
                // error.code = error.statusCode || error;
                // console.log(error);
                // error.payload = parseErrors(error);
                //
                // if (error.statusCode === 500 || error.statusCode === 404) {
                //     error.message = lang.error.oops;
                // }
                // else if (error.statusCode === 403) {
                //     error.message = lang.error['Access Denied']
                // }
                // else if (error.statusCode === 401) {
                //     error.message = lang.error['Authorization Required'];
                // } else if (error.statusCode === 'timeout') {
                //     error.message = lang.error.timeout;
                // }

                this.requesting--;
                return this.callback(cb, requestConfig,error);
            });
        } catch (error) {
            // error.code = error.code || error.statusCode;
            // if (error.code === '500') {
            //     error.message = 'Hệ thống đang gặp sự cố, vui lòng liên hệ với kĩ thuật để được trợ giúp!';
            // }
            //
            // error.payload = parseErrors(error);
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
        return new Promise(function(resolve, reject) {
            if (cache_ttl) {
                let data = M2Client.cache.get(requestConfig.endpoint, null);
                if (data) {
                    return resolve({
                        status: 200,
                        body: data
                    })
                }

            }

            M2Client.request(requestConfig, token, (error, response)=> {
                if (error) {
                    reject(error)
                }
                else {
                    if (handleResponse) {
                        handleResponse(response)
                    }

                    if (cache_ttl) {
                        M2Client.cache.set(requestConfig.endpoint, response.body, cache_ttl)
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