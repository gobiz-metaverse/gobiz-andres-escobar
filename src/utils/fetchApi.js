/**
 * created by Taobao dev team - 15/1/2018
 */

//import "fetch";
import { isEmpty } from 'lodash';
import 'whatwg-fetch';
import {BASE_URL} from "../App";

const HTTP_NO_CONTENT = 204;

/**
 * function fetch api from server
 * @param endpoint
 * @param payload
 * @returns {Promise<*>}
 */

export default async(endpoint, payload) => {

    // console.info(fetch);

    let fullURL = '';
    if (endpoint.startsWith('http')) {
        fullURL = endpoint;
    }
    else {
        // validate endpoint
        endpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        fullURL = BASE_URL + endpoint;
        console.error(fullURL);
        // calc url
        //const fullURL = endpoint.indexOf(process.env.FOBIZ_API_ROOT) === -1 ? process.env.FOBIZ_API_ROOT + endpoint : endpoint;
    }

    let res;

    // Nếu có mất mạng thì vẫn trả về mã lỗi như bình thường
    if(!navigator.onLine) {
        return {
            statusCode: "000",
            name: "Error",
            message: "No network connection"
        }
    }

    try {
        res = await fetch(fullURL,{...payload, timeout: 120000});
    } catch (err) {
        //let error  = new Error('Có lỗi xảy ra, vui lòng thử lại!');
        //error.statusCode = 'timeout';
        //throw err;
        console.error(err);
        return {
            status: !isEmpty(res) ? res.status : '',
            body: null
        }
    }

    // check status HTTP_NO_CONTENT
    if (res.status === HTTP_NO_CONTENT) {
        return true;
    }

    // if (res.body)
    if (res.headers.get('content-length') === 0) {
        return {
            status: res.status,
            body: null
        }
    }
    const json = res.body ? await res.json() : null;
    // if (!res.ok) {
    //     throw json.error;
    // }

    return {
        status: res.status,
        body: json
    };
};

