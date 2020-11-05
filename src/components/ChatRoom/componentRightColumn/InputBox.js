import React, { useContext } from 'react';
import { Send, Smile } from 'react-feather';
import { useForm } from 'react-hook-form';
import { MESSAGE_TYPE } from '../../../utils/constant';
import { chatInChannelOnDB } from '../../../utils/database';
import { generateId, getCurrentTimeStamp, getKeyByProperty } from '../../../utils/function';

const InputBox = props => {
    const { user, data } = props;
    const { register, handleSubmit, reset } = useForm();
    const currentTime = getCurrentTimeStamp();
    const userId = user?.userID;
    const channelId = data?.infor?.channelId;
    const displayName = user?.displayName;
    const avatar = user?.displayAvatar || '';

    const clearInput = () => reset();

    const sendMessage = async value => {
        const messageId = generateId(userId, channelId, value.messageContent)
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