import React from 'react';
import Popup from 'reactjs-popup';
import { DATABASE } from '../../../../utils/database';
import { Context as ChannelContext, actions as ChannelActions } from '../../../../contexts/Channel/ChannelContext';

const ConfirmDeleteChannel = props => {
    const { close, inforChannel } = props;
    const channelId = inforChannel.channelId;

    const acceptDelete = () => {
        DATABASE.ref(`/listChannel`).child(channelId).remove();
        DATABASE.ref(`/userInChannel`).child(channelId).remove();
        DATABASE.ref(`/chatInChannel`).child(channelId).remove();
        ChannelActions.deleteChannel(channelId);
        ChannelActions.hideChatContent();
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
                    <div className="title">Do you really want to delete this channel?</div>
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