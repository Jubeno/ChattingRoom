import React, {useState} from 'react';
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input, FormFeedback, Alert } from 'reactstrap';
import { useForm } from "react-hook-form";
import ErrorMessage from '../Common/ErrorMessage/ErrorMessage';
import './Workspace.scss'
import { ERROR_MESSAGE_NAME_WORKSPACE, ERROR_MESSAGE_PASSWORD, ERROR_MESSAGE_CONFIRM_PASSWORD } from '../../utils/constant';
import { validateWorkspace } from '../../utils/function';
import firebase from '../../Firebase';
import { useHistory } from 'react-router-dom';

const CreateSpace = () => {
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const [errorWorkSpace, setErrorWorkSpace] = useState({ isError: null, errorMessage: '' });
    const [errorPassword, setErrorPassword] = useState({isErrorPassword: false, errorPassword: ''})
    const [errorConfirmPassword, setErrorConfirmPassword] = useState({isErrorConfirmPassword: false, errorConfirmPassword: ''})
    const workspaceDB = firebase.database().ref('/workspace');

    const isValidateWorkSpaceName = async data => {
        const workspace = data.workspace;
        const isValidWorkspace = validateWorkspace(workspace);
        
        let isValid = true;
        if (workspace === '') {
            setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.EMPTY });
            isValid = false;
        } else if (!isValidWorkspace) {
            setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.INVALID })
            isValid = false;
        } else {
            await workspaceDB.orderByChild('workspace').equalTo(workspace).once("value",
                response => {
                    if (response.exists()) {
                        isValid = false;
                        setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.USED })
                    }
                }
            )
        }
        return isValid
    }

    const isValidatePassword = password => {
        let isValid = true;
        const nameRegex = /^[a-zA-Z0-9]+$/;
        if ( password.length === 0 ) { 
            isValid = false;
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.EMPTY});
        } else if ( password.length < 6 || password.length > 10 ) { 
            isValid = false;
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.TOO_SHORT});
        } else if ( !password.match(nameRegex) ) { 
            isValid = false;
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.INVALID});
        } else {
            setErrorPassword({ isErrorPassword: false, errorPassword: ''});
        }
        return isValid;
    }

    const isValidConfirmPassword = (password, confirmPassword) => {
        let isValid = true;
        if ( confirmPassword.length === 0 ) { 
            isValid = false;
            setErrorConfirmPassword({ isErrorConfirmPassword: true, errorConfirmPassword: ERROR_MESSAGE_PASSWORD.EMPTY});
        } else if ( password !== confirmPassword) {
            isValid = false;
            setErrorConfirmPassword({ isErrorConfirmPassword: true, errorConfirmPassword: ERROR_MESSAGE_CONFIRM_PASSWORD.NOT_MATCH });
        } else {
            setErrorConfirmPassword({ isErrorConfirmPassword: false, errorConfirmPassword: '' });
        }
        return isValid;
    }


    const createWorkspace = async data => {
        const isValidName = await isValidateWorkSpaceName(data);
        const isValidPassword = isValidatePassword(data.password);
        const isValidConfirm = isValidConfirmPassword(data.password, data.confirmPassword);
        const newWorkspace = workspaceDB.push();

        if (isValidName && isValidPassword && isValidConfirm) {
            (await newWorkspace).set({    
                "workspace": data.workspace,
                "password": data.password,
            }, () => {
                history.push('/workspace/profile');
            })
        }
    }

    const handleFocusName = () => {
        setErrorWorkSpace({ ...errorWorkSpace, isError: false })
    }
    const handleFocusPassword = () => {
        setErrorWorkSpace({ ...errorPassword, isError: false })
    }
    const handleFocusConfirmPassword = () => {
        setErrorWorkSpace({ ...errorConfirmPassword, isError: false })
    }

    const backToSignInWorkSpace = () => {
        history.push('/workspace');
    }

    return (
        <div className="create_workspace" id="workspace">
            <div className="top">
                <p className="go_to_create" onClick={backToSignInWorkSpace}>Back to signin workspace</p>
            </div>
            <div className="logo">
                <img src="/img/logo.png" alt="logo"/>
            </div>
            <Form onSubmit={handleSubmit(createWorkspace)} className="mb-3 container">
                <FormGroup>
                    <Label className="text-muted font-weight-bold">Enter your workspace:</Label>
                    <Input type="text" name="workspace" onFocus={handleFocusName} className=" text-muted" placeholder="yourname@work.xyz" innerRef={register} />
                </FormGroup>
                { errorWorkSpace.isError && <ErrorMessage content={errorWorkSpace.errorMessage} />}
                <FormGroup>
                    <Label className="text-muted font-weight-bold">Password:</Label>
                    <Input type="password" name="password" onFocus={handleFocusPassword} id="password" placeholder="Enter Your Password" innerRef={register}/>
                </FormGroup>
                { errorPassword.isErrorPassword && <ErrorMessage content={errorPassword.errorPassword} /> }
                <FormGroup>
                    <Label className="text-muted font-weight-bold">Confirm Password:</Label>
                    <Input type="password" name="confirmPassword" onFocus={handleFocusConfirmPassword} id="confirmPassword" placeholder="Enter Your Confirm Password" innerRef={register}/>
                </FormGroup>
                { errorConfirmPassword.isErrorConfirmPassword && <ErrorMessage content={errorConfirmPassword.errorConfirmPassword} /> }
                <Button variant="primary" color="success" type="submit" size="lg" block>Go to your own workspace</Button>
            </Form>
        </div>
    );
}

export default CreateSpace;