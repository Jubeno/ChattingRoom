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
                  defaultCountry: 'GB',
                  defaultNationalNumber: '1234567890',
                  loginHint: '+11234567890'
                }
            ]
        });
    }, [])

    return (
        <>
            <div id="firebaseui-auth-container"></div>
        </>
    );
}

export default LoginWithPhoneNumber;