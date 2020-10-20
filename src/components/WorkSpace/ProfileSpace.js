import React, { useState } from 'react';
import { Col, Row, Container, Form, Button } from 'reactstrap';
import { useStateValue } from '../../StateProvider';
import CreateNameWorkSpace from './component/CreateNameWorkSpace';
import CreatePurposeWorkSpace from './component/CreatePurposeWorkSpace';
import CreateUser from './component/CreateUser';
import './ProfileSpace.scss';
import { useForm } from "react-hook-form";

const ProfileSpace = () => {
    const [ { workspaceState }, dispatch ] = useStateValue();
    const { register, handleSubmit } = useForm();
    const [showButtonSubmit, setShowButtonSubmit] = useState(false);
    const createProfileWorkSpace = data => {
        console.log('%c data: ', 'color: red' , data);
    }

    return (
        <div className="vh-100 container_profile_workspace">
            {/* <h1 className="text-center text-uppercase mb-5 display-4 title">Create profile for your workspace</h1> */}
            <Form onSubmit={handleSubmit(createProfileWorkSpace)} className="h-100">
                <Container fluid className="profile_workspace h-100">
                    <div id="name_workspace">
                        <CreateNameWorkSpace register={register}/>
                    </div>
                    <div id="purpose_workspace">
                        <CreatePurposeWorkSpace register={register}/>
                    </div>
                    <div id="create_first_user">
                        <CreateUser 
                            register={register} 
                            showButton={() => setShowButtonSubmit(true)}
                            hideButton={() => setShowButtonSubmit(false)}
                        />
                    </div>
                </Container>
                { 
                    showButtonSubmit && 
                        <div className="bottom_bar">
                            <Button 
                                variant="primary" 
                                color="danger" 
                                type="submit" 
                                size="lg"
                                className="button_submit_create_profile"
                            >
                                Submit Profile Workspace
                            </Button>
                        </div>
                }
            </Form>
        </div>
    );
}

export default ProfileSpace;