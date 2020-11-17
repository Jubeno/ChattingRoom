import React from 'react';
import Popup from 'reactjs-popup';
import { DATABASE } from '../../../../utils/database';
import { Context as ChannelContext, actions as ChannelActions } from '../../../../contexts/Channel/ChannelContext';
import { generateId, getCurrentTimeStamp } from '../../../../utils/function';
import { MESSAGE_TYPE } from '../../../../utils/constant';

const ConfirmLeaveChannel = props => {
    const { close, inforChannel, userId, user } = props;
    const channelId = inforChannel.channelId;
    const currentTime = getCurrentTimeStamp();
    const messageId = generateId(userId, channelId, currentTime);

    const acceptLeave = async () => {
        // delete in channel
        await DATABASE
        .ref(`/userInChannel/${channelId}/members`)
        .child(userId)
        .remove();

        //send system message
        await DATABASE.ref(`/chatInChannel/${channelId}/listChat`).push().update({
            value: `${user.displayName} has leaved this channel`,
            messageType: MESSAGE_TYPE.SYSTEM,
            sendTime: currentTime,
            senderId: userId,
            receiverId: channelId,
            messageId
        })
        close();
        ChannelActions.hideChatContent();
    }

    const cancelLeave = () => {
        close();
    }

    return (
        <>
            <Popup
                open={true}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                className="confirm_leave_channel_popup"
            >
                <div className="top">
                    <div className="title">Do you really want to <span>leave</span> this channel?</div>
                </div>
                <div className="bottom">
                    <button className="button accept" onClick={acceptLeave}>OK</button>
                    <button className="button cancel" onClick={cancelLeave}>Cancel</button>
                </div>
            </Popup>
        </>
    );
}

export default ConfirmLeaveChannel;