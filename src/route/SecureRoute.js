import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
  } from "react-router-dom";
import moment from 'moment';
import { checkExpire } from '../utils/function';


const SecureRoute = ({ children, ...rest }) => {
    const isNotExpiredWorkSpace = checkExpire('expiredTimeWorkSpace');
    const isNotExpiredUserSession = checkExpire('expiredTimeUserSession');
    
    return (
        <Route  {...rest}
            render={({ location }) =>
            isNotExpiredWorkSpace 
                ?   isNotExpiredUserSession 
                        ? children 
                        : <Redirect to={{ pathname: "/login", state: { from: location } }} />
                : <Redirect to={{ pathname: "/workspace", state: { from: location } }} />
            }
        />
    );
}

export default SecureRoute;