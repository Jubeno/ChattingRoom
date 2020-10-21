import React, { useState, useEffect } from 'react';
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input } from 'reactstrap';
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
        <div className="container_">
            <div className="wrapper">
                <h1 className="display-3 text-center font-weight-bold text-white mb-5">STEP 3</h1>
                <p className="lead text-white font-weight-bold">Create an account for yourself!</p>
                    <Label className="text-white font-weight-bold">Nickname</Label>
                    <Input type="text" name="nickname" id="nickname" className="input" placeholder="Enter Your Nickname" innerRef={register}/>
                { errorName.isError && <ErrorMessage content={errorName.errorName} /> }
                    <Label className="text-white font-weight-bold">Password</Label>
                    <Input type="password" name="password" id="password" className="input" placeholder="Enter Your Password" innerRef={register}/>
                { errorPassword.isError && <ErrorMessage content={errorPassword.errorPassword} /> }
                    <Label className="text-white font-weight-bold">Confirm Password</Label>
                    <Input type="password" name="confirmPassword" id="confirmPassword" className="input mb-3" placeholder="Enter Your Confirm Password" onChange={handleChange} innerRef={register}/>
                { errorConfirmPassword.isError && <ErrorMessage content={errorConfirmPassword.errorConfirmPassword} /> }
                <div className="submit_profile">
                    <Button 
                        variant="primary" 
                        color="dark" 
                        type="submit" 
                        size="lg"
                        className="button_submit_create_profile"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CreateUser;