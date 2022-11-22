import OlympusClient from "../OlympusClient";

export default class BoardService {
    static getAllBoard(cb) {
        OlympusClient.request({
            endpoint: "/api/Hooks/call-jira?path=/board",
            //queryString: filter,
            method: "GET",
            mode: "free"
        }, cb);
    }

    static getBoard(boardId, cb) {
        OlympusClient.request({
            endpoint: `/api/Hooks/call-jira?path=/board/${boardId}`,
            //queryString: filter,
            method: "GET",
            mode: "free"
        }, cb);
    }

    static getSprints(boardId, cb) {
        OlympusClient.request({
            endpoint: `/api/Hooks/call-jira?path=/board/${boardId}/sprint`,
            //queryString: filter,
            method: "GET",
            mode: "free"
        }, cb);
    }
}