import React from 'react';
import User from '../components/User/User';
import { Route, Router, Switch } from 'react-router-dom';

const UserRoute = () => {

    return (
        <Switch>
            <Route exact path="/user" component={User} />
        </Switch>
    );
}

export default UserRoute;