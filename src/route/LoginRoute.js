import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import Login from '../components/Login/Login';
import LoginWithPhoneNumber from '../components/Login/LoginWithPhoneNumber';

const LoginRoute = props => {

    return (
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route path="/login/phone" component={LoginWithPhoneNumber} />
        </Switch>
    );
}

export default LoginRoute;