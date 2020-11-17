import React, { useEffect } from 'react';
import firebase from 'firebase';
import * as firebaseui from 'firebaseui';

const LoginWithPhoneNumber = () => {
    useEffect(() => {
        var ui = new firebaseui.auth.AuthUI(firebase.auth());

        ui.start('#firebaseui-auth-container', {
            signInOptions: [
                {
                  provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                  recaptchaParameters: {
                    type: 'image',
                    size: 'normal',
                    badge: 'bottomleft'
                  },
                  defaultCountry: 'VI',
                }
            ],
            // signInSuccessUrl: 'https://google.com.vn',
            callbacks: {
                signInSuccessWithAuthResult: function(auth, redirect) {
                    console.log('redirect: ', redirect);
                    console.log('auth: ', auth);
                    return true;
                }
            }
        });
    }, [])

    return (
        <>
            <div id="firebaseui-auth-container"></div>
        </>
    );
}

export default LoginWithPhoneNumber;