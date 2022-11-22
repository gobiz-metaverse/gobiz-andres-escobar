import {Redirect, Route} from "react-router-dom";
import {LocalStore} from "../../utils/LocalStore";
import React from "react";

export default class TodoRoute extends React.Component{

    render(){
        const { component: Component, RouteKey, location, ...rest } = this.props;
        const Key = RouteKey ? location.pathname + location.search : null;

        return(
            <Route exact={true} {...rest} key={Key} render={props => {
                return (
                    LocalStore.getInstance().read('todo_session')
                        ? <Component {...props} />
                        : <Redirect to={{ pathname: '/todos/login', state: { from: location } }} />
                )
            }} />
        );
    }
}