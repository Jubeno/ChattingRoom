import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input } from 'reactstrap';
import firebase from '../../Firebase';
import { useStateValue } from '../../StateProvider';
import { useForm } from "react-hook-form";
import ErrorMessage from '../Common/ErrorMessage/ErrorMessage';
import { ERROR_MESSAGE_NAME, ERROR_MESSAGE_PASSWORD, ERROR_MESSAGE_CONFIRM_PASSWORD } from '../../utils/constant';
import './SignUp.scss';

function SignUp() {
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const [showLoading, setShowLoading] = useState(false);
    const [errorName, setErrorName] = useState({isErrorName: false, errorName: ''})
    const [errorPassword, setErrorPassword] = useState({isErrorPassword: false, errorPassword: ''})
    const [errorConfirmPassword, setErrorConfirmPassword] = useState({isErrorConfirmPassword: false, errorConfirmPassword: ''})
    const usersOnDB = firebase.database().ref('users/');

    const validateNickname = nickname => {
        setShowLoading(false);
        const nameRegex = /^[a-zA-Z0-9]+$/;
        if ( nickname.length === 0 ) { 
            setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.EMPTY});
            return
        };
        if ( nickname.length < 6 || nickname.length > 10 ) { 
            setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.TOO_SHORT});
            return
        };
        if ( !nickname.match(nameRegex) ) { 
            setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.INVALID});
            return
        };
    }

    const validatePassword = password => {
        setShowLoading(false);
        const nameRegex = /^[a-zA-Z0-9]+$/;
        if ( password.length === 0 ) { 
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.EMPTY});
            return
        };
        if ( password.length < 6 || password.length > 10 ) { 
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.TOO_SHORT});
            return
        };
        if ( !password.match(nameRegex) ) { 
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.INVALID});
            return
        };
    }

    const validateConfirmPassword = (password, confirmPassword) => {
        if ( password.length === 0 ) { 
            setErrorPassword({ isErrorConfirmPassword: true, errorConfirmPassword: ERROR_MESSAGE_PASSWORD.EMPTY});
            return
        };
        if ( password !== confirmPassword) {
            setErrorConfirmPassword({ isErrorConfirmPassword: true, errorConfirmPassword: ERROR_MESSAGE_CONFIRM_PASSWORD.NOT_MATCH });
            return
        }
    }

    const isExistThisNickNameOnDB = nickname => {
        let result;
        usersOnDB.orderByChild('nickname').equalTo(nickname).once('value', response => {
            if ( response.exists() ) {
                setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.USED })
                result = true;
            } else {
                result = false;
            }
            
        })
        return result;
    }

    const signup = data => {
        validateNickname(data.nickname);
        validatePassword(data.password);
        validateConfirmPassword(data.password, data.confirmPassword);
        isExistThisNickNameOnDB(data.nickname);

    };

    return (
        <div className="signup" id="signup">
            {showLoading &&
                <Spinner color="primary" />
            }
            <Jumbotron className="container">
                <Link className="back_to_login" to="login">Back to Login</Link>
                <h1 className="display-5 text-center text-info">Sign Up</h1>
                <Form onSubmit={handleSubmit(signup)} className="mb-3">
                    <FormGroup>
                        <Label className="text-info">Nickname</Label>
                        <Input type="text" name="nickname" id="nickname" placeholder="Enter Your Nickname" innerRef={register}/>
                    </FormGroup>
                    { errorName.isErrorName && <ErrorMessage content={errorName.errorName} /> }
                    <FormGroup>
                        <Label className="text-info">Password</Label>
                        <Input type="password" name="password" id="password" placeholder="Enter Your Password" innerRef={register}/>
                    </FormGroup>
                    { errorPassword.isErrorPassword && <ErrorMessage content={errorPassword.errorPassword} /> }
                    <FormGroup>
                        <Label className="text-info">Confirm Password</Label>
                        <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Enter Your Confirm Password" innerRef={register}/>
                    </FormGroup>
                    { errorConfirmPassword.isErrorPassword && <ErrorMessage content={errorPassword.errorPassword} /> }
                    <Button variant="primary" color="danger" type="submit" size="lg" block>SignUp</Button>
                </Form>
                
                <h6 className="text-right dont_have_account">Already have account ? <Link to="/login">Sign in</Link></h6>
            </Jumbotron>
        </div>
    );
}

export default SignUp;