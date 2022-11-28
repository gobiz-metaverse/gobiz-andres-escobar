import React from "react";
import {Route, Switch} from 'react-router';
import asyncComponent from "./utils/AsyncComponent";
import {HashRouter} from "react-router-dom";
import BetRoute from './pages/BetRoute'
import {TopPlaying} from "./pages/bet/TopPlaying";
import Champion from "./pages/bet/Champion";
import BetHistory from "./pages/bet/BetHistory";

const AsyncDashboard = asyncComponent(() => import("./pages/dashboard"));
const AsyncMatch = asyncComponent(() => import("./pages/bet/Match"));
//import Warehouse from "./containers/Warehouse";

// import async - code splitting
const Async404 = asyncComponent(() => import("./pages/404"));
const AsyncTodos = asyncComponent(() => import("./pages/todos/index.jsx"));
export default (
    <HashRouter>
        <Switch>
            {/*<RequireLoginRoute exact path="/" component={AsyncDashboard}/>*/}
            <Route path="/todos" component={AsyncTodos}/>
            <Route exact path="/" component={AsyncDashboard}/>
            <BetRoute exact path="/matches/:id" component={AsyncMatch}/>
            <BetRoute exact path="/bet/outrights" component={Champion}/>
            <BetRoute exact path="/report/top-playing" component={TopPlaying}/>
            <BetRoute exact path="/report/bet-history" component={BetHistory}/>
            <Route path="*" component={Async404}/>
        </Switch>
    </HashRouter>
);