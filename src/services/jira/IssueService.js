import JiraClient from "../JiraClient";

export default class IssueService {
    static getCurrentActiveSprintTask(boardIds) {

    }

    static searchIssue(token, jql, fields, startAt = 0) {
        return JiraClient.requestPromise({
            endpoint: JiraClient.baseUrl + `/search`,
            method: 'POST',
            mode: 'free',
            body: {
                jql: jql,
                fields: fields,
                startAt,
                maxResults: 100
            }
        }, token)
    }

    static editIssue(token, idOrKey, body) {
        return JiraClient.requestPromise({
            endpoint: JiraClient.baseUrl + `/issue/${idOrKey}`,
            method: 'POST',
            mode: 'free',
            body: body
        }, token)
    }

    static updateDueDate(token, idOrKey, due_date) {
        return JiraClient.requestPromise({
            endpoint: JiraClient.baseUrl + `/issue/${idOrKey}`,
            method: 'PUT',
            mode: 'free',
            body: {
                fields : {
                    customfield_10063 : due_date
                }
            }
        }, token)
    }
}