/**
 * created by Taobao dev team - 2/2/2018
 */
import {cookieReadObject, cookieSaveObject} from "./cookie";
import {isLocalStorageAvailble, localStorageReadObject, localStorageSaveObject} from "./localStorage";

/**
 * Singleton LocalStore
 * @type {{getInstance}}
 */
export const LocalStore  = (function () {
    var instance;

    function createInstance() {
        var object = {};

        if (isLocalStorageAvailble()) {
            object.save = localStorageSaveObject;
            object.read = localStorageReadObject;
        } else {
            object.save = cookieSaveObject;
            object.read = cookieReadObject;
        }

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();