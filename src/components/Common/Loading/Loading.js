import React from 'react';
import { RiseLoader } from 'react-spinners';
import { css } from "@emotion/core";
import './Loading.scss';

const Loading = () => {
    const override = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
    return (
        <div className="loading" id="loading">
            <div className="overlay" />
            <div className="content">
                    <RiseLoader 
                        css={override}
                        size={20}
                        color={"#27E0BA"}
                    />
                </div>
        </div>
    );
}

export default Loading;