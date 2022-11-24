import React from "react";
import Login from "./Login";
import {Route, Switch} from 'react-router';
import TodoRoute from "./TodoRoute";
import TodoList from "./TodoList";
import Dashboard from "../dashboard";

export default class TodoApp extends React.Component {
    render() {
        //const loginPath = this.props.match.path +'/login';
        //const signupPath = this.props.match.path + '/signup';
        return (
            <Switch>
                <Route exact path='/todos/login' component={Login}/>
                <TodoRoute path='/todos/' component={TodoList} />
                <Route path="/" exact component={Dashboard} />
            </Switch>
        );
    }
}