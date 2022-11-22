import {Redirect, Route} from "react-router-dom";
import {LocalStore} from "../utils/LocalStore";
import React from "react";
import {LOGIN_URL} from "../services/bet/Consts";

function parseQueryStringToObject(queryString) {
    if (queryString && queryString.indexOf('?') > -1) {
        queryString = queryString.replace('?', '')
    }

    let params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
}

export default class BetRoute extends React.Component{
    componentDidMount() {
        let queryString = window.location.search || '';
        if (queryString.indexOf('?') > -1) {
            queryString = queryString.replace(/\?/g, '')
        }

        const params = parseQueryStringToObject(queryString);

        if (params && params['access-token']) {
            LocalStore.getInstance().save('bet_session', decodeURI(params['access-token']))
        }
        else {
            let bet_session = LocalStore.getInstance().read('bet_session');

            if (!bet_session) {
                window.location = LOGIN_URL
            }
        }

    }

    render(){
        const { component: Component, RouteKey, location, ...rest } = this.props;
        const Key = RouteKey ? location.pathname + location.search : null;

        return(
            <Route exact={true} {...rest} key={Key} render={props => {
                return (
                    LocalStore.getInstance().read('bet_session')
                        ? <Component {...props} />
                        : null
                )
            }} />
        );
    }
}