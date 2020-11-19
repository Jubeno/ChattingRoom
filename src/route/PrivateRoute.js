import React from 'react'
import {
    Route,
    Redirect
} from "react-router-dom";
import { checkExpire } from '../utils/function';

const PrivateRoute = ({ children, ...rest }) => {
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