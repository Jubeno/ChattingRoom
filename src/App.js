import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import Login from './components/Login/Login';
import RoomList from './components/RoomList';
import AddRoom from './components/AddRoom';
import ChatRoom from './components/ChatRoom';
import SecureRoute from './route/SecureRoute';
import WorkSpaceRoute from './route/WorkSpaceRoute';
import SignUp from './components/SignUp/SignUp';
import { checkExpire } from './utils/function';
import { MainProvider } from './MainProvider';
import UserRoute from './route/UserRoute';

const App = () => {
  let location = useLocation();
  const isNotExpiredWorkSpace = checkExpire('expiredTimeWorkSpace');
  const isNotExpiredUserSession = checkExpire('expiredTimeUserSession');
  const workspace = localStorage.getItem('workspace');
  return (
    <MainProvider>
      <Router>
        <div>
          <Redirect to={{ pathname: "/workspace", state: { from: location } }} />
          { isNotExpiredWorkSpace && <Redirect to={{ pathname: "/login", state: { workspace } }} /> }
          { isNotExpiredUserSession && <Redirect to={{ pathname: "/user", state: { workspace } }} /> }
          <Switch>
            <Route path="/workspace" component={WorkSpaceRoute} />
            <SecureRoute path="/user"><UserRoute /></SecureRoute>
            <SecureRoute path="/login">
              <Login />
            </SecureRoute>
            <SecureRoute path="/signup">
              <SignUp />
            </SecureRoute>
            <SecureRoute path="/roomlist">
              <RoomList />
            </SecureRoute>
            <SecureRoute path="/addroom">
              <AddRoom />
            </SecureRoute>
            <SecureRoute path="/chatroom/:room">
              <ChatRoom />
            </SecureRoute>
          </Switch>
        </div>
      </Router>
    </MainProvider>
  );
}

export default App;