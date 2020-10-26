import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import CreateUserProfile from '../components/User/CreateUserProfile';

const UserRoute = () => {

    return (
        <Switch>
            {/* <Route exact path="/user" component={User} /> */}
            <Route exact path="/user/create_profile/:id" component={CreateUserProfile} />
        </Switch>
    );
}

export default UserRoute;