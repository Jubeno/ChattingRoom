import React from 'react';
import Popup from 'reactjs-popup';

const UpdateProfileDone = props => {
    const { close, closeUpdate } = props;

    const closePopup = () => {
        close();
        closeUpdate && closeUpdate();
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
                        Successfully updated your profile
                    </div>
                </div>
                <div className="bottom">
                    <button className="button accept" onClick={closePopup}>
                        OK
                    </button>
                </div>
            </Popup>
        </>
    );
}

export default UpdateProfileDone;