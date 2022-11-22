/**
 * created by Taobao dev team - 16/1/2018
 */
import _ from 'lodash'

/**
 * check if we can use localStorage
 * @returns {boolean}
 */
export function isLocalStorageAvailble() {
    try {
        localStorage.setItem("test", "test");
        localStorage.setItem("test", undefined);

        return true;
    } catch (e) {
        return false;
    }
}

/**
 * save object to local storage
 * @param key
 * @param data
 */
export function localStorageSaveObject(key, data) {
    try {
        localStorage.setItem(key, _.isObject(data) ? JSON.stringify(data) : data);
    } catch (e) {
        console.log("Cannot save data to local storage", e);
    }
}

/**
 * read localStorage
 * @param key
 * @returns {any}
 */
export function localStorageReadObject(key) {
    if (localStorage == null || typeof key !== 'string') {
        throw new Error("fail to read object to localStorage");
    }

    let result = localStorage.getItem(key);

    try {
        return JSON.parse(result);
    } catch (e) {
        return result;
    }
}