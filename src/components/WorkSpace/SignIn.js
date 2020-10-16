import React, { useState, useEffect } from 'react';
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input, FormFeedback, Alert } from 'reactstrap';
import { useForm } from "react-hook-form";
import ErrorMessage from '../Common/ErrorMessage/ErrorMessage';
import './Workspace.scss'
import { ERROR_MESSAGE_NAME_WORKSPACE } from '../../utils/constant';
import { validateWorkspace } from '../../utils/function';
import firebase from '../../Firebase';
import { useHistory } from 'react-router-dom';

const SignIn = () => {
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const [errorWorkSpace, setErrorWorkSpace] = useState({ isError: null, errorMessage: '' });
    const messaging = firebase.messaging();
    const workspaceDB = firebase.database().ref('/workspace');

    // console.log('%c workspaceDB', 'color: red' , workspaceDB);
    // useEffect(() => {
    //     messaging
    //     .requestPermission()
    //         .then(async function() {
    //             const token = await messaging.getToken();
    //             localStorage.setItem("deviceToken", token);
    //         })
    //         .catch(function(err) {
    //             console.log("Unable to get permission to notify.", err);
    //         });

    //         navigator.serviceWorker.addEventListener("message", message => console.log(message));
    // }, []);

    const isValidFormData = async data => {
        const workspace = data.workspace;
        const prefix = workspace.split("@")[0];
        const domain = workspace.split("@")[1];
        const isValidWorkspace = validateWorkspace(workspace);
        let isValid = true;

        if (workspace === '') {
            setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.EMPTY })
            isValid = false;
        } else if (!isValidWorkspace) {
            setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.INVALID })
            isValid = false;
        } else {
            await workspaceDB.once("value",
                response => {
                    const data = response.val();
                    if (!data[prefix]) {
                        setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.NOT_EXIST })
                        isValid = false;
                    } else {
                        if(`${data[prefix].name}.${data[prefix].domain}` !== domain) {
                            setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.NOT_EXIST })
                            isValid = false;
                        }
                    }
                }
            )
        }
        return isValid;
    }

    const loginWorkspace = async data => {
        const isValid = await isValidFormData(data);
        if(isValid) {
            localStorage.setItem('isInWorkSpace', 'true');
            // history.push('/login')
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