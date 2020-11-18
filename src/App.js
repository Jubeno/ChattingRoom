import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './components/Login/Login';
import WorkSpaceRoute from './route/WorkSpaceRoute';
import { MainProvider } from './MainProvider';
import PrivateRoute from './route/PrivateRoute';
import AuthenticatedRoutes from './route/AuthenticatedRoutes';
import LoginRoute from './route/LoginRoute';
import firebase from 'firebase';

const App = () => {
  firebase.auth().onAuthStateChanged(function(user) {
    // console.log('user: ', user);
  });
  return (
    <MainProvider>
      <Router>
          <Switch>
            <Route path="/workspace" component={WorkSpaceRoute} />
            <Route path="/login" component={LoginRoute} />
            <PrivateRoute >
                <AuthenticatedRoutes />
            </PrivateRoute>
          </Switch>
      </Router>
    </MainProvider>
  );
}

export default App;