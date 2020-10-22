import React, { useState, useEffect } from 'react';
import { Jumbotron, Spinner, Form,  Button, FormGroup,  Label, Input } from 'reactstrap';
import { useForm } from "react-hook-form";
import ErrorMessage from '../../Common/ErrorMessage/ErrorMessage';
import { ERROR_MESSAGE_NAME, ERROR_MESSAGE_PASSWORD, ERROR_MESSAGE_CONFIRM_PASSWORD } from '../../../utils/constant';
import firebase from '../../../Firebase';
import { ChevronLeft } from 'react-feather';
import { Context as WorkSpaceContext, actions as WorkSpaceActions } from '../../../contexts/WorkSpace/WorkSpaceContext';
import { useHistory } from 'react-router-dom';

const CreateUser = props => {
    const history = useHistory();
    const { activeCreateUser } = props;
    const { register, handleSubmit } = useForm();
    const [errorName, setErrorName] = useState({isError: false, errorMessage: ''})
    const [errorPassword, setErrorPassword] = useState({isError: false, errorMessage: ''})
    const [errorConfirmPassword, setErrorConfirmPassword] = useState({isError: false, errorMessage: ''})
    const usersOnDB = firebase.database().ref('user/list/');
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
   
    const validateNickname = async nickname => {
        let isValid = true;
        const nameRegex = /^[a-zA-Z0-9]+$/;
        const isNotExistOnDB = await existThisNickNameOnDB(nickname);
        if ( nickname.length === 0 ) { 
            isValid = false;
            setErrorName({ isError: true, errorMessage: ERROR_MESSAGE_NAME.EMPTY});
        } else if ( nickname.length < 6 || nickname.length > 10 ) { 
            isValid = false;
            setErrorName({ isError: true, errorMessage: ERROR_MESSAGE_NAME.TOO_SHORT});
        } else if ( !nickname.match(nameRegex) ) { 
            isValid = false;
            setErrorName({ isError: true, errorMessage: ERROR_MESSAGE_NAME.INVALID});
        } else if(isNotExistOnDB) {
            isValid = false; 
            setErrorName({ isError: true, errorMessage: ERROR_MESSAGE_NAME.USED});
        } else {
            setErrorName({ isError: false, errorMessage: '' })
        }
        return isValid;
    }

    const validatePassword = password => {
        let isValid = true;
        const nameRegex = /^[a-zA-Z0-9]+$/;
        if ( password.length === 0 ) { 
            isValid = false;
            setErrorPassword({ isError: true, errorMessage: ERROR_MESSAGE_PASSWORD.EMPTY});
        } else if ( password.length < 6 || password.length > 10 ) { 
            isValid = false;
            setErrorPassword({ isError: true, errorMessage: ERROR_MESSAGE_PASSWORD.TOO_SHORT});
        } else if ( !password.match(nameRegex) ) { 
            isValid = false;
            setErrorPassword({ isError: true, errorMessage: ERROR_MESSAGE_PASSWORD.INVALID});
        } else {
            setErrorPassword({ isError: false, errorMessage: ''});
        }
        return isValid;
    }

    const validateConfirmPassword = (password, confirmPassword) => {
        let isValid = true;
        if ( confirmPassword.length === 0 ) { 
            isValid = false;
            setErrorConfirmPassword({ isError: true, errorMessage: ERROR_MESSAGE_PASSWORD.EMPTY});
        } else if ( password !== confirmPassword) {
            isValid = false;
            setErrorConfirmPassword({ isError: true, errorMessage: ERROR_MESSAGE_CONFIRM_PASSWORD.NOT_MATCH });
        } else {
            setErrorConfirmPassword({ isError: false, errorMessage: '' });
        }
        return isValid;
    }

    const createNewUser = ( nickname, password ) => {
        const newUser = usersOnDB.push();
        newUser.set({
            'nickname': nickname,
            'password': password
        });
    }

    const existThisNickNameOnDB = async (nickname) => {
        let isExist = false;
        await usersOnDB.orderByChild('nickname').equalTo(nickname).once('value', response => {
            if ( response.exists() ) {
                isExist = true;
                setErrorName({ isError: true, errorMessage: ERROR_MESSAGE_NAME.USED })
            }
            
        })
        return isExist;
    }

    const createUser = async data => {
        const nickname = data.nickname;
        const password = data.password;
        const confirmPassword = data.confirmPassword;
        const isValidName = await validateNickname(nickname);
        const isValidPassword = validatePassword(password);
        const isValidConfirmation = validateConfirmPassword(password, confirmPassword);
        if ( isValidName && isValidPassword && isValidConfirmation ) {
            createNewUser(nickname, password);
            history.push('/user');
        }
    };

    const handleFocusName = () => setErrorName({ isError: false, errorMessage: ''});
    const handleFocusPassword = () => setErrorPassword({ isError: false, errorMessage: ''});
    const handleFocusConfirm = () => setErrorConfirmPassword({ isError: false, errorMessage: ''});

    const goToPrevStep = () => WorkSpaceActions.goToPrevStep();

    const isDisabledButtonSubmit = () => {
        return name && password && confirmPassword;
    } 

    const handleChangeName = event => setName(event.target.value);
    const handleChangePassword = event => setPassword(event.target.value);
    const handleChangeConfirmation = event => setConfirmPassword(event.target.value);
    return (
        <form className="container_" onSubmit={handleSubmit(createUser)}>
            {activeCreateUser && <div className="btn_comeback" onClick={goToPrevStep}><ChevronLeft size="30"/></div>}
            <div className="wrapper">
                <h1 className="display-3 text-center font-weight-bold text-white mb-5">STEP 3</h1>
                <p className="lead text-white font-weight-bold">Create an account for yourself!</p>
                    <Label className="text-white font-weight-bold">Nickname</Label>
                    <Input 
                        type="text" 
                        name="nickname" 
                        id="nickname" 
                        className="input" 
                        placeholder="Enter Your Nickname" 
                        innerRef={register}
                        onFocus={handleFocusName}
                        onChange={handleChangeName}
                    />
                { errorName.isError && <ErrorMessage content={errorName.errorMessage} /> }
                    <Label className="text-white font-weight-bold">Password</Label>
                    <Input 
                        type="password" 
                        name="password" 
                        id="password" 
                        className="input" 
                        placeholder="Enter Your Password" 
                        innerRef={register}
                        onFocus={handleFocusPassword}
                        onChange={handleChangePassword}
                    />
                { errorPassword.isError && <ErrorMessage content={errorPassword.errorMessage} /> }
                    <Label className="text-white font-weight-bold">Confirm Password</Label>
                    <Input 
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword" 
                        className="input mb-3" 
                        placeholder="Enter Your Confirm Password" 
                        innerRef={register}
                        onFocus={handleFocusConfirm}
                        onChange={handleChangeConfirmation}
                    />
                { errorConfirmPassword.isError && <ErrorMessage content={errorConfirmPassword.errorMessage} /> }
                <div className="submit_profile">
                    <Button 
                        variant="primary" 
                        color="dark" 
                        type="submit" 
                        size="lg"
                        className="button_submit_create_profile"
                        disabled={!isDisabledButtonSubmit()}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default CreateUser;