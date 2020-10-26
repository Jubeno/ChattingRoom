import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom/ChatRoom';


const UserRoute = () => {

    return (
        <Switch>
            <Route exact path="/chatroom/:id" component={ChatRoom} />
        </Switch>
    );
}

export default UserRoute;