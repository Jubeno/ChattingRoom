import React from 'react';
import Popup from 'reactjs-popup';

const MissingProfile = props => {
    const { close, subject } = props;
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
                        Can't update profile without <span>{subject}</span>
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