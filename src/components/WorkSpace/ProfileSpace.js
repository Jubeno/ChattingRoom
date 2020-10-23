import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, Container, Form, Button } from 'reactstrap';
import CreateNameWorkSpace from './component/CreateNameWorkSpace';
import CreatePurposeWorkSpace from './component/CreatePurposeWorkSpace';
import CreateUser from './component/CreateUser';
import './ProfileSpace.scss';
import PreviewProfileWorkSpace from './component/PreviewProfileWorkSpace';
import { Context as WorkSpaceContext, actions as WorkSpaceActions } from '../../contexts/WorkSpace/WorkSpaceContext';
import { useHistory } from 'react-router-dom';

const ProfileSpace = () => {
    const history = useHistory();
    const [statePush, setStatePush] = useState({});
    const { currentStep } = useContext(WorkSpaceContext).state;
    const activeName = currentStep === 1 && 'activeStep';
    const activePurpose = currentStep === 2 && 'activeStep';
    const activeCreateUser = currentStep === 3 && 'activeStep';

    useEffect(() => {
        if( history.location.state === undefined ) return;
        setStatePush(history.location.state);
    },[history.location.state]);

    return (
        <div className=" container_profile_workspace">
            <h1 className="text-center text-uppercase display-4 title">Create profile for your workspace</h1>
            <PreviewProfileWorkSpace />
            <div>
                <Container fluid className="profile_workspace">
                    <div id="name_workspace" className={`disabledStep ${activeName}`}>
                        <CreateNameWorkSpace history={statePush} activeName={activeName}/>
                    </div>
                    <div id="purpose_workspace" className={`disabledStep ${activePurpose}`}>
                        <CreatePurposeWorkSpace history={statePush}  activePurpose={activePurpose}/>
                    </div>
                    <div id="create_first_user" className={`disabledStep ${activeCreateUser}`}>
                        <CreateUser history={statePush} activeCreateUser={activeCreateUser}/>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default ProfileSpace;