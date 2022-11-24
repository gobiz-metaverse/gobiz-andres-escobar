import {LOGIN_URL} from "./Consts";

export function handleResponse(response) {
    console.info(response);
    if (response.status === 401)
    {
        window.location = LOGIN_URL
    }
}