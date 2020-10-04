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
import { StateProvider } from './StateProvider';
import { initialState, reducer } from './MainContext/reducer';
import SignUp from './components/SignUp/SignUp';

const App = () => {
  let location = useLocation();

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Router>
        <div>
          <Redirect to={{ pathname: "/roomlist", state: { from: location } }} />
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
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
    </StateProvider>
  );
}

export default App;