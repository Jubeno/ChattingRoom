import React, { useContext } from 'react';
import { Send, Smile } from 'react-feather';
import { useForm } from 'react-hook-form';
import { MESSAGE_TYPE } from '../../../utils/constant';
import { chatInChannelOnDB, messageOnDB } from '../../../utils/database';
import { generateId, getCurrentTimeStamp, getKeyByProperty } from '../../../utils/function';
import { Context, actions } from '../../../contexts/Channel/ChannelContext';

const InputBox = props => {
    const { user, data } = props;
    const { register, handleSubmit, reset } = useForm();
    const currentTime = getCurrentTimeStamp();
    const userId = user?.userID;
    const channelId = data?.infor?.channelId;
    const displayName = user?.displayName;
    const avatar = user?.displayAvatar || '';
    const conversationId = data?.conversationId;
    const friendId = data?.friendId;
    const isChannel = data?.type === "CHANNEL";

    const clearInput = () => reset();

    const sendMessage = async value => {
        if(value.messageContent === '') return
        const messageId = generateId(userId, isChannel ? channelId : friendId, value.messageContent)

        if (isChannel) {
            await chatInChannelOnDB.once('value', response => {
                const key = getKeyByProperty( response.val(), 'channelId', channelId)
                const newMessage = chatInChannelOnDB.child(`${key}/listChat`).push();
    
                newMessage.update({
                    value: value.messageContent,
                    sendTime: currentTime,
                    senderId: userId,
                    receiverId: channelId,
                    messageId,
                    messageType: MESSAGE_TYPE.TEXT,
                    displayName,
                    avatar
                })
            })
        } else {
            await messageOnDB.once('value', response => {
                const key = getKeyByProperty( response.val(), 'conversationID', conversationId )
                const newMessage = messageOnDB.child(`${key}/listChat`).push();

                newMessage.update({
                    value: value.messageContent,
                    sendTime: currentTime,
                    senderId: userId,
                    receiverId: friendId,
                    messageId,
                    messageType: MESSAGE_TYPE.TEXT,
                    displayName,
                    avatar
                })
            })
        }
        clearInput();
    }

    return (
        <>
            <form 
                onSubmit={handleSubmit(sendMessage)}
                className="input_box"
            >
                <div className="emoji_message">
                    <Smile />
                </div>
                <input 
                    type="text"
                    className="input_send_message"
                    name="messageContent"
                    ref={register}
                    placeholder="Type a message"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="button_submit"
                >
                    <Send size={35} color="#fff"/>
                </button>
            </form>
        </>
    );
}

export default InputBox;