import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
  } from "react-router-dom";

const SecureRoute = ({ children, ...rest }) => {
    return (
        <Route  {...rest}
            render={({ location }) =>
                localStorage.getItem('nickname') 
                ?  children  
                : <Redirect to={{ pathname: "/login", state: { from: location } }} />
            }
        />
    );
}

export default SecureRoute;