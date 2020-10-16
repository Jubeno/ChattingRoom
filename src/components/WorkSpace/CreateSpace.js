import React, {useState} from 'react';
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input, FormFeedback, Alert } from 'reactstrap';
import { useForm } from "react-hook-form";
import ErrorMessage from '../Common/ErrorMessage/ErrorMessage';
import './Workspace.scss'
import { ERROR_MESSAGE_NAME_WORKSPACE } from '../../utils/constant';
import { validateWorkspace } from '../../utils/function';
import firebase from '../../Firebase';
import { useHistory } from 'react-router-dom';

const CreateSpace = () => {
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const [errorWorkSpace, setErrorWorkSpace] = useState({ isError: null, errorMessage: '' });
    const [errorPassword, setErrorPassword] = useState({isErrorPassword: false, errorPassword: ''})
    const [errorConfirmPassword, setErrorConfirmPassword] = useState({isErrorConfirmPassword: false, errorConfirmPassword: ''})
    const messaging = firebase.messaging();
    const workspaceDB = firebase.database().ref('/workspace');

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

    const createWorkspace = async data => {
        // const isValid = await isValidFormData(data);
        // if(isValid) {
        //     localStorage.setItem('isInWorkSpace', 'true');
        //     // history.push('/login')
        // }
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
                    <Label className="text-muted font-weight-bold">Password</Label>
                    <Input type="password" name="password" onFocus={handleFocusPassword} id="password" placeholder="Enter Your Password" innerRef={register}/>
                </FormGroup>
                { errorPassword.isErrorPassword && <ErrorMessage content={errorPassword.errorPassword} /> }
                <FormGroup>
                    <Label className="text-muted font-weight-bold">Confirm Password</Label>
                    <Input type="password" name="confirmPassword" onFocus={handleFocusConfirmPassword} id="confirmPassword" placeholder="Enter Your Confirm Password" innerRef={register}/>
                </FormGroup>
                { errorConfirmPassword.isErrorConfirmPassword && <ErrorMessage content={errorConfirmPassword.errorConfirmPassword} /> }
                <Button variant="primary" color="success" type="submit" size="lg" block>Go to your own workspace</Button>
            </Form>
        </div>
    );
}

export default CreateSpace;