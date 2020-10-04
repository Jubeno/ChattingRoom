import React from 'react';
import './ErrorMessage.scss';

const ErrorMessage = ({ content }) => {

    return (
        <p id='error_message' className='error_message'>{content}</p>
    );
}

export default ErrorMessage;