import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input, FormFeedback, Alert } from 'reactstrap';
import firebase from '../../Firebase';
import { useStateValue } from '../../StateProvider';
import { useForm } from "react-hook-form";
import { getDataOnDB } from '../../utils/function';
import ErrorMessage from '../Common/ErrorMessage/ErrorMessage';
import { ERROR_MESSAGE_NAME, ERROR_MESSAGE_PASSWORD } from '../../utils/constant';
import './Login.scss';

function Login() {
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const { nickname, password } = history.location.state;
    const [showLoading, setShowLoading] = useState(false);
    const [errorName, setErrorName] = useState({isErrorName: false, errorName: ''})
    const [errorPassword, setErrorPassword] = useState({isErrorPassword: false, errorPassword: ''})
    const usersOnDB = firebase.database().ref('users/');
    const defaultNickName = nickname !== undefined ? nickname : '';
    const defaultPassword = password !== undefined ? password : '';

    const checkPassword = password => {
        getDataOnDB('password', password, 'users/').once('value', response => {
            if( response.exists() ) {
                history.push('/roomlist');
                setShowLoading(false);
            }
        })
    }

    const validateNickname = nickname => {
        setShowLoading(false);
        const nameRegex = /^[a-zA-Z0-9]+$/;
        if ( nickname.length === 0 ) { 
            setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.EMPTY});
        } else if ( nickname.length < 6 || nickname.length > 10 ) { 
            setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.TOO_SHORT});
        } else if ( !nickname.match(nameRegex) ) { 
            setErrorName({ isErrorName: true, errorName: ERROR_MESSAGE_NAME.INVALID});
        } else {
            setErrorName({ isErrorName: false, errorName: '' })
        }
    }

    const validatePassword = password => {
        setShowLoading(false);
        const nameRegex = /^[a-zA-Z0-9]+$/;
        if ( password.length === 0 ) { 
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.EMPTY});
        } else if ( password.length < 6 || password.length > 10 ) { 
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.TOO_SHORT});
        } else if ( !password.match(nameRegex) ) { 
            setErrorPassword({ isErrorPassword: true, errorPassword: ERROR_MESSAGE_PASSWORD.INVALID});
        } else {
            setErrorPassword({ isErrorPassword: false, errorPassword: '' })
        }
    }

    const login = data => {
        validateNickname(data.nickname);
        validatePassword(data.password);

        usersOnDB.orderByChild('nickname').equalTo(data.nickname).once('value', response => {
            if ( response.exists() ) {
                localStorage.setItem('nickname', data.nickname);
                checkPassword(data.password);
            } else {
                // const newUser = usersOnDB.push();
                // newUser.set(data);
                // localStorage.setItem('nickname', data.nickname);
                // // history.push('/roomlist');
                // setShowLoading(false);
            }
        })
    };

    return (
        <div className="login" id="login">
            {showLoading &&
                <Spinner color="primary" />
            }
            <Jumbotron className="container">
                <h1 className="display-3">Hello, welcome to chatting room!!!</h1>
                <h1 className="display-5 text-center text-info">Login</h1>
                <Form onSubmit={handleSubmit(login)} className="mb-3">
                    <FormGroup>
                        <Label className="text-info">Nickname</Label>
                        <Input type="text" name="nickname" id="nickname" placeholder="Enter Your Nickname" innerRef={register} defaultValue={defaultNickName} />
                    </FormGroup>
                    { errorName.isErrorName && <ErrorMessage content={errorName.errorName} /> }
                    <FormGroup>
                        <Label className="text-info">Password</Label>
                        <Input type="password" name="password" id="password" placeholder="Enter Your Password" innerRef={register} defaultValue={defaultPassword}/>
                    </FormGroup>
                    { errorPassword.isErrorPassword && <ErrorMessage content={errorPassword.errorPassword} /> }
                    <Button variant="primary" color="danger" type="submit" size="lg" block>Login</Button>
                    <Button variant="primary" color="primary" type="submit" size="lg" block>Sign in with Google</Button>
                </Form>
                <h6 className="text-right dont_have_account">Don't have account ? <Link to="/signup">Sign up</Link></h6>
            </Jumbotron>
        </div>
    );
}

export default Login;