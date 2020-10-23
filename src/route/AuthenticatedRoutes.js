import React from 'react';
import {
    Switch,
    Route,
} from "react-router-dom";
import UserRoute from './UserRoute';


const AuthenticatedRoutes = () => {

    return (
        <Switch>
            <Route path="/user" component={UserRoute} />
        </Switch>
    );
}

export default AuthenticatedRoutes;
