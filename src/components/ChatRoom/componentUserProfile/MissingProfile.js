import React from 'react';
import Popup from 'reactjs-popup';

const MissingProfile = props => {
    const { close, subject } = props;

    const renderContent = () => {
        let content = {};
        switch (subject) {
            case 'avatar':
                content = <div>Can't update profile without <span>{subject}</span></div>
                break;
            case 'display name':
                content = <div>Can't update profile without <span>{subject}</span></div>
                break;
            case 'phone number':
                content = <div>Double check your <span>{subject}</span>, make sure it is in the correct format</div>
                break;
            case 'phone number exist on database':
                content = <div>Your <span>phone number </span> 
                has been registered previously. Please try another one.!</div>
                break;
            default:
                break;
        }
        return content;
    }

    return (
        <>
            <Popup
                open={true}
                className="missing_avatar_popup"
                closeOnDocumentClick={false}
                closeOnEscape={false}
            >
                <div className="top">
                    <div className="title">
                        {renderContent()}
                    </div>
                </div>
                <div className="bottom">
                    <button className="button accept" onClick={close}>
                        OK
                    </button>
                </div>
            </Popup>
        </>
    );
}

export default MissingProfile;