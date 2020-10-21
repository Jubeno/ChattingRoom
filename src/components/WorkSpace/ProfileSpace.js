import React, { useState } from 'react';
import { Col, Row, Container, Form, Button } from 'reactstrap';
import CreateNameWorkSpace from './component/CreateNameWorkSpace';
import CreatePurposeWorkSpace from './component/CreatePurposeWorkSpace';
import CreateUser from './component/CreateUser';
import './ProfileSpace.scss';
import { useForm } from "react-hook-form";
import PreviewProfileWorkSpace from './component/PreviewProfileWorkSpace';

const ProfileSpace = () => {
    const { register, handleSubmit } = useForm();
    const [showButtonSubmit, setShowButtonSubmit] = useState(false);
    const createProfileWorkSpace = data => {
        console.log('%c data: ', 'color: red' , data);
    }

    return (
        <div className=" container_profile_workspace">
            <h1 className="text-center text-uppercase display-4 title">Create profile for your workspace</h1>
            <PreviewProfileWorkSpace />
            <Form onSubmit={handleSubmit(createProfileWorkSpace)}>
                <Container fluid className="profile_workspace">
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
            </Form>
        </div>
    );
}

export default ProfileSpace;