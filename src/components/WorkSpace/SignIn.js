import React, { useState } from 'react';
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input, FormFeedback, Alert } from 'reactstrap';
import { useForm } from "react-hook-form";
import ErrorMessage from '../Common/ErrorMessage/ErrorMessage';
import './Workspace.scss'
import { ERROR_MESSAGE_NAME_WORKSPACE } from '../../utils/constant';
import { validateWorkspace } from '../../utils/function';

const SignIn = () => {
    const { register, handleSubmit } = useForm();
    const [errorWorkSpace, setErrorWorkSpace] = useState({ isError: false, errorMessage: '' });

    const loginWorkspace = data => {
        console.log('data: ', data);
        const workspace = data.workspace;
        const isValidWorkspace = validateWorkspace(workspace);
        if (workspace === '') {
            setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.EMPTY })
        }
        if (!isValidWorkspace) {
            setErrorWorkSpace({ isError: true, errorMessage: ERROR_MESSAGE_NAME_WORKSPACE.INVALID })
        }
        // check on db
    }

    const handleFocus = () => {
        setErrorWorkSpace({ ...errorWorkSpace, isError: false })
    }

    return (
        <div className="signin" id="workspace">
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
                {/* <Button variant="primary" color="primary" type="submit" size="lg" block>Sign in with Google</Button> */}
            </Form>
        </div>
    );
}

export default SignIn;