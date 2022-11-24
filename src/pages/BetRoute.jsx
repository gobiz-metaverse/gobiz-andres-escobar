import {Redirect, Route} from "react-router-dom";
import {LocalStore} from "../utils/LocalStore";
import React from "react";
import {LOGIN_URL} from "../services/bet/Consts";
import jwtDecode from "jwt-decode";

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
        // const data = jwtDecode('eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzo3OTBhZjczOS01ZjkwLTQwZDMtOWNlOC1jNWMzZTM5Mjg0M2EiLCJ0eXAiOiJKV1QifQ.eyJhZGRyZXNzIjp7ImNvdW50cnkiOiJ2biJ9LCJhdF9oYXNoIjoiOFZkcFNsRXFrTGJZb0xxWkswSXlBdyIsImF1ZCI6WyJiZDAzYWE1Yi1iY2M1LTRjZDItYjI3Zi01MzE2NWUzZGZmZWEiXSwiYXV0aF90aW1lIjoxNjY5MjY2NjMzLCJlbWFpbCI6ImRvYW50aGlkdXllbkBnb2Jpei5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNjY5MzA5ODM0LCJnZW5kZXIiOiJOL0EiLCJpYXQiOjE2NjkyNjY2MzQsImlzcyI6Imh0dHBzOi8vb2lkYy5hdXRoZW4ubWUvIiwianRpIjoiZDcyNDU1ZjgtM2E3Yi00NDMyLTk3ODktNWM0NjM1YzQ1MTE1IiwibG9jYWxlIjoidmlfVk4iLCJuYW1lIjoiRHV5w6puIERvw6NuIiwibm9uY2UiOiIiLCJwZXJtaXNzaW9ucyI6W10sInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6ImR1eWVuZHQiLCJyYXQiOjE2NjkyNjY2MzMsInNpZCI6Ijc0ZGQ2OWY0LTQ4YTgtNDEzZC05YzU1LTdhNjYwZWMyMjE1YSIsInN1YiI6ImR1eWVuZHQiLCJ1cGRhdGVkX2F0IjoxNTkzNjkxNjE2LCJ6b25laW5mbyI6IkFzaWEvSG9fQ2hpX01pbmgifQ.XVw1XMy8KQ4zY51rSwwHfv8K-BSf668Lem9atp_SDWxGoD46WTBz6pWrDTzWpAOZ7rluRUdAcMnyAExYmThFx3gdrooExCpE2hx7GwGWSGml0EJgHKYp3EtT4w6tJxRnSdKUV3GxeeCgfuUSderr1xFNFgOZMomhN93Mawdh-SHQwetJNHZDh8mmG94rmiWtPN68q0cH-cOogb4xhiO0cKg8C4UWxTpwCD8u3RJC6uYbWTzBusqnzxy013OHYAqAftfezIJ2G1xW9SYqOyvaIhuks3yUzBRCVqLUaFCVPuc0qwtf8PfJy-HMAh8HM6e_8OEhDyXI-95amB4-9Ttgcs7W0E43USEgTbxSs44cAeLdtKgtRvsziM8767p6cYhS_MtiJ-6ezLaJqp5ZoJUJxQ3UrOqQB_FDz6KYs7r9XenjiT3GUoCOhZV5iORn_hzZpKUo-j-3LJ_Sq-yK8dXbEhFW4UwbfFTB-MATqNPDjXY8IzTsxuqD6q7a2pKQFElBT4j5KrajjqEgP3bWqcWz15kW_RsWRNFXLDXDIoObwHZqHbGNjBs79cvBpqfplm5rhpNedjZMUDBGOaO0BBCorbLJ3e6cHPXyPi-pwvWM_LQtEisCjZi9wTgNoU2o5QUZChFHkFS8FW0U7M2QoLtwB7wpBvblV1uv2-7HZFOrC2o%0A%20%20%20%20%20%20')
        // console.log('datatoken', data)
        if(params && params['id_token']) {
            const idToken = jwtDecode(params['id_token'])
            // const idToken = jwtDecode('eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzo3OTBhZjczOS01ZjkwLTQwZDMtOWNlOC1jNWMzZTM5Mjg0M2EiLCJ0eXAiOiJKV1QifQ.eyJhZGRyZXNzIjp7ImNvdW50cnkiOiJ2biJ9LCJhdF9oYXNoIjoiOFZkcFNsRXFrTGJZb0xxWkswSXlBdyIsImF1ZCI6WyJiZDAzYWE1Yi1iY2M1LTRjZDItYjI3Zi01MzE2NWUzZGZmZWEiXSwiYXV0aF90aW1lIjoxNjY5MjY2NjMzLCJlbWFpbCI6ImRvYW50aGlkdXllbkBnb2Jpei5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNjY5MzA5ODM0LCJnZW5kZXIiOiJOL0EiLCJpYXQiOjE2NjkyNjY2MzQsImlzcyI6Imh0dHBzOi8vb2lkYy5hdXRoZW4ubWUvIiwianRpIjoiZDcyNDU1ZjgtM2E3Yi00NDMyLTk3ODktNWM0NjM1YzQ1MTE1IiwibG9jYWxlIjoidmlfVk4iLCJuYW1lIjoiRHV5w6puIERvw6NuIiwibm9uY2UiOiIiLCJwZXJtaXNzaW9ucyI6W10sInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6ImR1eWVuZHQiLCJyYXQiOjE2NjkyNjY2MzMsInNpZCI6Ijc0ZGQ2OWY0LTQ4YTgtNDEzZC05YzU1LTdhNjYwZWMyMjE1YSIsInN1YiI6ImR1eWVuZHQiLCJ1cGRhdGVkX2F0IjoxNTkzNjkxNjE2LCJ6b25laW5mbyI6IkFzaWEvSG9fQ2hpX01pbmgifQ.XVw1XMy8KQ4zY51rSwwHfv8K-BSf668Lem9atp_SDWxGoD46WTBz6pWrDTzWpAOZ7rluRUdAcMnyAExYmThFx3gdrooExCpE2hx7GwGWSGml0EJgHKYp3EtT4w6tJxRnSdKUV3GxeeCgfuUSderr1xFNFgOZMomhN93Mawdh-SHQwetJNHZDh8mmG94rmiWtPN68q0cH-cOogb4xhiO0cKg8C4UWxTpwCD8u3RJC6uYbWTzBusqnzxy013OHYAqAftfezIJ2G1xW9SYqOyvaIhuks3yUzBRCVqLUaFCVPuc0qwtf8PfJy-HMAh8HM6e_8OEhDyXI-95amB4-9Ttgcs7W0E43USEgTbxSs44cAeLdtKgtRvsziM8767p6cYhS_MtiJ-6ezLaJqp5ZoJUJxQ3UrOqQB_FDz6KYs7r9XenjiT3GUoCOhZV5iORn_hzZpKUo-j-3LJ_Sq-yK8dXbEhFW4UwbfFTB-MATqNPDjXY8IzTsxuqD6q7a2pKQFElBT4j5KrajjqEgP3bWqcWz15kW_RsWRNFXLDXDIoObwHZqHbGNjBs79cvBpqfplm5rhpNedjZMUDBGOaO0BBCorbLJ3e6cHPXyPi-pwvWM_LQtEisCjZi9wTgNoU2o5QUZChFHkFS8FW0U7M2QoLtwB7wpBvblV1uv2-7HZFOrC2o%0A%20%20%20%20%20%20')
            LocalStore.getInstance().save('userInfo', idToken)
        }
        if (params && params['access-token']) {
            LocalStore.getInstance().save('bet_session', decodeURI(params['access-token']))
            window.location = '/'

            //TODO: redirect đến đúng trang
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