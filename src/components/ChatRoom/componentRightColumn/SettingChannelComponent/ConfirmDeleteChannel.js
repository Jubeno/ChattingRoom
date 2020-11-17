import React from 'react';
import Popup from 'reactjs-popup';


const ConfirmDeleteChannel = props => {
    const { close } = props;

    const acceptDelete = () => {
        
    }

    const cancelDelete = () => {
        close();
    }

    return (
        <>
            <Popup
                open={true}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                className="confirm_delete_channel_popup"
            >
                <div className="top">
                    <div className="title">Do you really want to <span>delete</span> this channel?</div>
                </div>
                <div className="bottom">
                    <button className="button accept" onClick={acceptDelete}>OK</button>
                    <button className="button cancel" onClick={cancelDelete}>Cancel</button>
                </div>
            </Popup>
        </>
    );
}

export default ConfirmDeleteChannel;