import React, { useState, useEffect } from 'react';
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input } from 'reactstrap';
import { useStateValue } from '../../../StateProvider';
import { useForm } from "react-hook-form";
import ErrorMessage from '../../Common/ErrorMessage/ErrorMessage';
import { ERROR_MESSAGE_NAME, ERROR_MESSAGE_PASSWORD, ERROR_MESSAGE_CONFIRM_PASSWORD } from '../../../utils/constant';
// import './SignUp.scss';

const CreateUser = props => {
    const { register, showButton, hideButton } = props;
    const [errorName, setErrorName] = useState({isError: false, errorName: ''})
    const [errorPassword, setErrorPassword] = useState({isError: false, errorPassword: ''})
    const [errorConfirmPassword, setErrorConfirmPassword] = useState({isError: false, errorConfirmPassword: ''})

    const handleChange = (event) => {
        const lengthValue = event.target.value.length;
        if(lengthValue > 0) {
            showButton();
        } else {
            hideButton()
        }
    }

    return (
        <Jumbotron className="container_">
            <div className="wrapper">
                <h1 className="display-3 text-center text-dark mb-5">STEP 3</h1>
                <p className="lead">Create an account for yourself</p>
                {/* <FormGroup> */}
                    <Label className="text-muted font-weight-bold">Nickname</Label>
                    <Input type="text" name="nickname" id="nickname" className="input" placeholder="Enter Your Nickname" innerRef={register}/>
                {/* </FormGroup> */}
                { errorName.isError && <ErrorMessage content={errorName.errorName} /> }
                {/* <FormGroup> */}
                    <Label className="text-muted font-weight-bold">Password</Label>
                    <Input type="password" name="password" id="password" className="input" placeholder="Enter Your Password" innerRef={register}/>
                {/* </FormGroup> */}
                { errorPassword.isError && <ErrorMessage content={errorPassword.errorPassword} /> }
                {/* <FormGroup> */}
                    <Label className="text-muted font-weight-bold">Confirm Password</Label>
                    <Input type="password" name="confirmPassword" id="confirmPassword" className="input" placeholder="Enter Your Confirm Password" onChange={handleChange} innerRef={register}/>
                {/* </FormGroup> */}
                { errorConfirmPassword.isError && <ErrorMessage content={errorConfirmPassword.errorConfirmPassword} /> }
            </div>
        </Jumbotron>
    );
}

export default CreateUser;