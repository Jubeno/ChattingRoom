import React from 'react';
import {
    Switch,
    Route,
} from "react-router-dom";
import UserRoute from './UserRoute';
import ChatRoomRoutes from './ChatRoomRoutes';


const AuthenticatedRoutes = () => {

    return (
        <Switch>
            <Route path="/user" component={UserRoute} />
            <Route path="/chatroom" component={ChatRoomRoutes} />
        </Switch>
    );
}

export default AuthenticatedRoutes;
