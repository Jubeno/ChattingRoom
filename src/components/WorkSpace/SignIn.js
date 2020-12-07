import React, { useState, useEffect } from 'react';
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input, FormFeedback, Alert } from 'reactstrap';
import { useForm } from "react-hook-form";
import ErrorMessage from '../Common/ErrorMessage/ErrorMessage';
import './Workspace.scss'
import { ERROR_MESSAGE_NAME_WORKSPACE, EXPIRED_TIME } from '../../utils/constant';
import { validateWorkspace } from '../../utils/function';
import firebase from '../../Firebase';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Loading from '../Common/Loading/Loading';




const SignIn = () => {
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const [errorWorkSpace, setErrorWorkSpace] = useState({ isError: null, errorMessage: '' });
    const listWorkSpaceDb = firebase.database().ref('/workspace/list');
    const [loading, setLoading] = useState(false);

    const isValidFormData = async data => {
        const workspace = data.workspace;
        const isValidWorkspace = validateWorkspace(workspace);
        let isValid = true;

        if (workspace === '') {
            setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.EMPTY })
            isValid = false;
        } else if (!isValidWorkspace) {
            setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.INVALID })
            isValid = false;
        } else {
            await listWorkSpaceDb.orderByChild('workspace').equalTo(workspace).once("value",
                response => {
                    if (!response.exists()) {
                        isValid = false;
                        setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.NOT_EXIST });
                    }
                }
            )
        }
        setLoading(false);
        return isValid;
    }

    const loginWorkspace = async data => {
        setLoading(true);
        const isValid = await isValidFormData(data);
        
        if(isValid) {
            localStorage.setItem('workspace', data.workspace);

            setLoading(false);
            history.push('/login', { workspace: data.workspace });
        }
    }

    const handleFocus = () => {
        setErrorWorkSpace({ ...errorWorkSpace, isError: false })
    }

    const goToCreateWorkSpace = () => {
        // history.push('/workspace/create'); // for testing
    }

    return (
        <>
            { loading && <Loading /> }
            <div className="signin" id="workspace">
                <div className="top">
                    <p className="go_to_create" onClick={goToCreateWorkSpace}>Create your own workspace</p>
                </div>
                <div className="logo">
                    <img src="/img/logo.png" alt="logo"/>
                </div>
                <Form onSubmit={handleSubmit(loginWorkspace)} className="mb-3 container">
                    <FormGroup>
                        <Label className="text-muted font-weight-bold">Enter your workspace:</Label>
                        <Input type="text" name="workspace" onFocus={handleFocus} className="input text-muted" placeholder="yourname@work.xyz" innerRef={register} />
                    </FormGroup>
                    { errorWorkSpace.isError && <ErrorMessage content={errorWorkSpace.errorMessage} />}

                    <Button variant="primary" color="danger" type="submit" size="lg" block>Go to your workspace</Button>
                </Form>
            </div>
        </>
    );
}

export default SignIn;