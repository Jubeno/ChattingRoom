import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import CreateSpace from '../components/WorkSpace/CreateSpace';
import ProfileSpace from '../components/WorkSpace/ProfileSpace';
import SignIn from '../components/WorkSpace/SignIn';

const WorkSpaceRoute = () => {

    return (
        <Switch>
            <Route path={["/","/workspace"]} component={SignIn} />
            <Route exact path="/workspace/create" component={CreateSpace} />
            <Route exact path="/workspace/profile" component={ProfileSpace} />
        </Switch>
    );
}

export default WorkSpaceRoute;