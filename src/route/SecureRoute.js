import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
  } from "react-router-dom";
import moment from 'moment';


const SecureRoute = ({ children, ...rest }) => {
    const expiredTime = localStorage.getItem('expiredTimeWorkSpace');

    const checkExpire = () => {
        let result = true;
        if( expiredTime === null ) {
            result = false;
        } else {
            const currentTime = moment().format('YYYY-MM-DD HH:mm');
            const expiredTimeFormated = moment(expiredTime, 'DDMMYYYYHHmm').format('YYYY-MM-DD HH:mm');
            const isBefore = moment(currentTime).isBefore(expiredTimeFormated);
            if( !isBefore ) {
                result = false;
            }
        }
        return result;
    }

    const isNotExpired = checkExpire();
    
    return (
        <Route  {...rest}
            render={({ location }) =>
            isNotExpired 
                ?  children  
                : <Redirect to={{ pathname: "/workspace", state: { from: location } }} />
            }
        />
    );
}

export default SecureRoute;