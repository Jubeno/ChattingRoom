import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import CreateSpace from '../components/WorkSpace/CreateSpace';
import SignIn from '../components/WorkSpace/SignIn';

const WorkSpaceRoute = () => {

    return (
        <Switch>
            <Route exact path="/workspace" component={SignIn} />
            <Route exact path="/workspace/create" component={CreateSpace} />
        </Switch>
    );
}

export default WorkSpaceRoute;