import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import CreateSpace from '../components/WorkSpace/CreateSpace';
import ProfileSpace from '../components/WorkSpace/ProfileSpace';
import SignIn from '../components/WorkSpace/SignIn';

const WorkSpaceRoute = props => {

    return (
        <Switch>
            <Route exact path="/workspace" component={SignIn} />
            <Route path="/workspace/create" component={CreateSpace} />
            <Route path="/workspace/profile" component={ProfileSpace} />
        </Switch>
    );
}

export default WorkSpaceRoute;