import React, { useContext, useState } from 'react';
import { Col, Row, Container, Form, Button } from 'reactstrap';
import CreateNameWorkSpace from './component/CreateNameWorkSpace';
import CreatePurposeWorkSpace from './component/CreatePurposeWorkSpace';
import CreateUser from './component/CreateUser';
import './ProfileSpace.scss';
import PreviewProfileWorkSpace from './component/PreviewProfileWorkSpace';
import { Context as WorkSpaceContext, actions as WorkSpaceActions } from '../../contexts/WorkSpace/WorkSpaceContext';

const ProfileSpace = () => {
    const [showButtonSubmit, setShowButtonSubmit] = useState(false);
    const { currentStep } = useContext(WorkSpaceContext).state;
    const activeName = currentStep === 1 && 'activeStep';
    const activePurpose = currentStep === 2 && 'activeStep';
    const activeCreateUser = currentStep === 3 && 'activeStep';
    return (
        <div className=" container_profile_workspace">
            <h1 className="text-center text-uppercase display-4 title">Create profile for your workspace</h1>
            <PreviewProfileWorkSpace />
            <div>
                <Container fluid className="profile_workspace">
                    <div id="name_workspace" className={`disabledStep ${activeName}`}>
                        <CreateNameWorkSpace activeName={activeName}/>
                    </div>
                    <div id="purpose_workspace" className={`disabledStep ${activePurpose}`}>
                        <CreatePurposeWorkSpace  activePurpose={activePurpose}/>
                    </div>
                    <div id="create_first_user" className={`disabledStep ${activeCreateUser}`}>
                        <CreateUser activeCreateUser={activeCreateUser}/>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default ProfileSpace;