import M2Client from "../M2Client";

export default class CustomerService {
    static getAll(baseUrl, token, query) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/customers`,
            method: 'GET',
            mode: 'free',
            queryString: query
        }, token)
    }

    static patch(baseUrl, token, username, data) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/customers/${username}`,
            method: 'PATCH',
            mode: 'free',
            body: data
        }, token)
    }

    static getBalance(baseUrl, token, tenantCode, username) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/tenant/${tenantCode}/account/${username}/balance`
        }, token)
    }

    static get(baseUrl, token, username) {
        return M2Client.requestPromise({
            endpoint: baseUrl + `/admin/customers/${username}`
        }, token)
    }
}