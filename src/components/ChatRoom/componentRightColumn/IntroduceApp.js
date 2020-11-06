import React from 'react';
import DelayImage from '../../Common/DelayImage/DelayImage';

const IntroduceApp = () => {

    return (
        <>
            <div className="introduce_app">
                <p className="welcome_text">Welcome to Benoo! Awesomw application for your organization</p>
                <div className="image">
                    <DelayImage src="/img/introduce.webp"/>
                </div>
            </div>
        </>
    );
}

export default IntroduceApp;