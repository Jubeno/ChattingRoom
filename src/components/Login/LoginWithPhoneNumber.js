import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

const LoginWithPhoneNumber = () => {
        // Configure FirebaseUI.
        const uiConfig = {
            // Popup signin flow rather than redirect flow.
            signInFlow: 'popup',
            // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
            signInSuccessUrl: 'https://firebase.google.com/docs/auth/web/phone-auth?authuser=1',
            signInOptions: [
                firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ]
        };

    return (
        <>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </>
    );
}

export default LoginWithPhoneNumber;