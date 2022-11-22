/**
 * created by Taobao dev team - 16/1/2018
 */

import _ from 'lodash'
import cookie from 'react-cookies';

/**
 * save object to cookie
 * @param key
 * @param data
 */
export function cookieSaveObject(key, data) {
    //save(key,data,{ path: '/' });
    //cookie.save(key,data,{ path: '/' });
    try {
        cookie.save(key, _.isObject(data) ? JSON.stringify(data) : data, {path: '/'});
    }
    catch (e) {
        console.log("Cannot save data to local cookie", e);
    }
}

/**
 * read cookie
 * @param key
 * @returns {any}
 */
export function cookieReadObject(key) {

    if (cookie == null) {
        throw new Error("fail to read object to Cookie");
    }
    //load cookie from brower
    let result = cookie.load(key);
    try {
        return JSON.parse(result);
    }
    catch (e) {
        return result;
    }
}

/**
 * delete cookie
 * @param key
 * @constructor
 */
export function ClearCookieObject(key) {
    //clear cookie
    cookie.remove(key, {path: '/'});
}
