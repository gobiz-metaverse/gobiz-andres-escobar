import JiraClient from "../JiraClient";

export default class UserService {
    static login(username, password) {
        let token = window.btoa(`${username}:${password}`);

        return JiraClient.requestPromise({
            endpoint: JiraClient.baseUrl + `/myself`,
            method: 'GET',
            mode: 'free'
        }, token)
    }
}