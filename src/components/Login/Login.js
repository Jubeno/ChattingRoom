import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input, FormFeedback, Alert } from 'reactstrap';
import firebase from '../../Firebase';
import { useForm } from "react-hook-form";
import { getKeyByProperty, setToken } from '../../utils/function';
import ErrorMessage from '../Common/ErrorMessage/ErrorMessage';
import { ERROR_MESSAGE_NAME, ERROR_MESSAGE_PASSWORD } from '../../utils/constant';
import './Login.scss';
import Loading from '../Common/Loading/Loading';

function Login() {
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const workspace = history.location.state?.workspace || localStorage.getItem('workspace');
    const [loading, setLoading] = useState(false);
    const [errorName, setErrorName] = useState({isErrorName: false, errorName: ''})
    const [errorPassword, setErrorPassword] = useState({isErrorPassword: false, errorPassword: ''})
    const usersOnDB = firebase.database().ref('/user/list');

    const checkPassword = async password => {
        let isValid = false;
        await usersOnDB.orderByChild('password').equalTo(password).once('value', response => {
            if( response.exists() ) {
                isValid = true;
            }
        })
        setLoading(false);
        return isValid;
    }

    const validateNickname = nickname => {
        let isValid = true;
        const nameRegex = /^[a-zA-Z0-9]+$/;
        if ( nickname.length === 0 ) { 
            isValid = false;
            setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.EMPTY});
            setLoading(false);
        } else if ( nickname.length < 6 || nickname.length > 10 ) { 
            isValid = false;
            setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.TOO_SHORT});
            setLoading(false);
        } else if ( !nickname.match(nameRegex) ) { 
            isValid = false;
            setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.INVALID});
            setLoading(false);
        } else {
            setErrorName({ isErrorName: false, errorName: '' })
            setLoading(false);
        }
        return isValid;
    }

    const validatePassword = password => {
        let isValid = true;
        const nameRegex = /^[a-zA-Z0-9]+$/;
        if ( password.length === 0 ) { 
            isValid = false;
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.EMPTY});
            setLoading(false);
        } else if ( password.length < 6 || password.length > 10 ) { 
            isValid = false;
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.TOO_SHORT});
            setLoading(false);
        } else if ( !password.match(nameRegex) ) { 
            isValid = false;
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.INVALID});
            setLoading(false);
        } else {
            setErrorPassword({ isErrorPassword: false, errorPassword: '' })
            setLoading(false);
        }
        return isValid;
    }

    const checkIsMissingProfile = async userID => {
        let isMissingProfile = false;
        await usersOnDB.orderByChild('userID').equalTo(userID).once('value', response => {
            const value = Object.values(response.val())[0];
            if(value.isMissingProfile) {
                isMissingProfile = true;
            }
        })
        return isMissingProfile;
    }

    const getUserId = async (nickname, workspace) => {
        let userId = '';
        await usersOnDB.orderByChild('nickname_workspace').equalTo(`${nickname}_${workspace}`).once('value', response => {
            if(response.exists()) {
                userId = Object.values(response.val())[0].userID;
            }
        })
        return userId;
    }

    const login = async data => {
        setLoading(true);
        const isValidName = validateNickname(data.nickname);
        const isValidPassword = validatePassword(data.password);
        const userId = await getUserId(data.nickname, workspace);
        if(!isValidName || !isValidPassword) return
        usersOnDB.orderByChild('nickname').equalTo(data.nickname).once('value', async response => {
            if ( response.exists() ) {
                const value = response.val();
                localStorage.setItem('nickname', data.nickname);
                const isMatchPassword = await checkPassword(data.password);
                if ( isMatchPassword ) {
                    await setToken(usersOnDB, data.nickname, 'nickname', Object.values(value));
                    const isMissingProfile = await checkIsMissingProfile(userId);
                    if(isMissingProfile) {
                        setLoading(false);
                        history.push(`/user/create_profile/${userId}`, { workspace, nickname: data.nickname });
                    } else {
                        setLoading(false);
                        history.push(`/chatroom/${userId}`, { workspace, nickname: data.nickname });
                    }
                } else {
                    setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.NOT_MATCH })
                }
            } else {
                setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.NOT_EXIST })
            }
        })
        
    };

    const handleFocusNickName = () => {
        setErrorName({ ...errorName, isErrorName: false });
    }
    const handleFocusPassword = () => {
        setErrorName({ ...errorPassword, isErrorPassword: false });
    }

    return (
        <>
            { loading && <Loading /> }
            <div className="login pt-5" id="login">
                <Jumbotron className="container pb-3 w-50">
                    <h1 className="display-5 mb-5">Welcome to <span className="text-uppercase">{workspace}</span> workspace!!</h1>
                    <h1 className="display-5 text-left text-muted mb-3">Login</h1>
                    <Form onSubmit={handleSubmit(login)} className="mb-3">
                        <FormGroup>
                            <Label className="text-muted font-weight-bold">Nickname</Label>
                            <Input type="text" name="nickname" id="nickname" placeholder="Enter Your Nickname" onFocus={handleFocusNickName} innerRef={register} />
                        </FormGroup>
                        { errorName.isErrorName && <ErrorMessage content={errorName.errorName} /> }
                        <FormGroup>
                            <Label className="text-muted font-weight-bold">Password</Label>
                            <Input type="password" name="password" id="password" placeholder="Enter Your Password" onFocus={handleFocusPassword} innerRef={register} />
                        </FormGroup>
                        { errorPassword.isErrorPassword && <ErrorMessage content={errorPassword.errorPassword} /> }
                        <Button variant="primary" color="danger" type="submit" size="lg" className="mb-5" block>Login</Button>
                    </Form>
                    <h5 className="text-right font-weight-light font-italic display-5 text-muted">(*) Please use the account and password provided by your manager to log in. </h5>
                    {/* <Link to="/login/phone" className="text-right font-weight-light font-italic display-5 text-muted">Login with your phone number</Link> */}
                </Jumbotron>
            </div>
        </>
    );
}

export default Login;