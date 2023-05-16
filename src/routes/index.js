import React from 'react';
import {HashRouter as Router, Route, Switch,Redirect} from 'react-router-dom';

import Register from "../pages/register";
import Forget from "../pages/forget";
import Replace from "../pages/replace";
import NotFound from "../pages/notfound";
import Home from "../pages/home";
import Login from "../pages/login";


export default class Routes extends React.Component{
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/forget" component={Forget} />
                    <Route exact path="/replace" component={Replace} />
                    <Route exact path="/404" component={NotFound} />
                    <Route exact path="/home" component={Home} />
                    <Redirect to="/404" />
                </Switch>
            </Router>
        );
    }
}