import {Route} from "react-router-dom";
import React from "react";


export default class BetRoute extends React.Component{
    render(){
        const { component: Component, RouteKey, location, ...rest } = this.props;
        console.log('this.props', this.props)
        const Key = RouteKey ? location.pathname + location.search : null;

        return(
            <Route exact={true} {...rest} key={Key} render={props => {
                return (
                    <Component {...props} />
                )
            }} />
        );
    }
}