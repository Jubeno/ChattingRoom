import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
  } from "react-router-dom";

const SecureRoute = ({ children, ...rest }) => {
    const isInWorkSpace = localStorage.getItem('isInWorkSpace') === 'true' ;
    return (
        <Route  {...rest}
            render={({ location }) =>
                isInWorkSpace 
                ?  children  
                : <Redirect to={{ pathname: "/workspace", state: { from: location } }} />
            }
        />
    );
}

export default SecureRoute;