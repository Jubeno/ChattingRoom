import React from 'react'
import {
    Route,
    Redirect
} from "react-router-dom";
import moment from 'moment';

const PrivateRoute = ({ children, ...rest }) => {

    const checkExpire = (target) => {
        const token = localStorage.getItem(target) || '';
        const decode = JSON.parse( window.atob(`${token}`));
        const expiredTime = decode.expiredTime;
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
    const isNotExpiredWorkSpace = checkExpire('token');
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isNotExpiredWorkSpace ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: '/workspace',
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

export default PrivateRoute