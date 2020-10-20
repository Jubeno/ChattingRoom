import React, { useState, useEffect } from 'react';
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input, FormFeedback, Alert } from 'reactstrap';
import { useForm } from "react-hook-form";
import ErrorMessage from '../Common/ErrorMessage/ErrorMessage';
import './Workspace.scss'
import { ERROR_MESSAGE_NAME_WORKSPACE, EXPIRED_TIME } from '../../utils/constant';
import { setExpiredTimeWorkSpace, validateWorkspace } from '../../utils/function';
import firebase from '../../Firebase';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useStateValue } from '../../StateProvider';




const SignIn = () => {
    const { register, handleSubmit } = useForm();
    const [{ workspaceState }, dispatch] = useStateValue();
    const history = useHistory();
    const [errorWorkSpace, setErrorWorkSpace] = useState({ isError: null, errorMessage: '' });
    const listWorkSpaceDb = firebase.database().ref('/workspace/list');

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
        return isValid;
    }

    const loginWorkspace = async data => {
        dispatch({ type: 'setKeyWorkSpace', payload: '123123123123123' })
        const isValid = await isValidFormData(data);
        
        if(isValid) {
            localStorage.setItem('workspace', data.workspace);
            await setExpiredTimeWorkSpace(listWorkSpaceDb, data.workspace, 'workspace');
            history.push('/login', { workspace: data.workspace });
        }
    }

    const handleFocus = () => {
        setErrorWorkSpace({ ...errorWorkSpace, isError: false })
    }

    const goToCreateWorkSpace = () => {
        history.push('/workspace/create');
    }

    return (
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
    );
}

export default SignIn;