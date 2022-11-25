import BetClient from "../BetClient";
import {BET_BASE_URL} from "./Consts";
import {handleResponse} from "./utils";
import {LocalStore} from "../../utils/LocalStore";

export default class MatchService {
    static getMatches(query) {
        let bet_session = LocalStore.getInstance().read('bet_session');

        return BetClient.requestPromise({
            endpoint: BET_BASE_URL + `/matches`,
            queryString: query
        },bet_session,handleResponse)
    }

    static getMatch(id) {
        let bet_session = LocalStore.getInstance().read('bet_session');

        return BetClient.requestPromise({
            endpoint: BET_BASE_URL + `/matches/${id}`
        },bet_session,handleResponse)
    }

    static getOdds(id) {
        let bet_session = LocalStore.getInstance().read('bet_session');

        return BetClient.requestPromise({
            endpoint: BET_BASE_URL + `/matches/${id}/odds`
        },bet_session,handleResponse)
    }

    static bet(matchId, type, betOn, money) {
        let bet_session = LocalStore.getInstance().read('bet_session');

        return BetClient.requestPromise({
            endpoint: BET_BASE_URL + `/bets`,
            method: 'POST',
            body: {
                matchId: matchId,
                type: type,
                code: betOn,
                money: money
            }
        },bet_session,handleResponse)
    }

    static getBetsByMatchAndUser(matchCode, userId) {
        let bet_session = LocalStore.getInstance().read('bet_session');

        return BetClient.requestPromise({
            endpoint: BET_BASE_URL + `/bets`,
            method: 'GET',
            queryString: {
                matchCode: matchCode,
                username: userId
            }
        },bet_session,handleResponse)
    }

    static getBetsByUser(userId) {
        let bet_session = LocalStore.getInstance().read('bet_session');

        return BetClient.requestPromise({
            endpoint: BET_BASE_URL + `/bets`,
            method: 'GET',
            queryString: {
                username: userId
            }
        },bet_session,handleResponse)
    }
}