import React, { useState, useContext } from 'react';
import { Plus, Send, Smile } from 'react-feather';
import { useForm } from 'react-hook-form';
import { MESSAGE_TYPE } from '../../../utils/constant';
import { chatInChannelOnDB, messageOnDB } from '../../../utils/database';
import { generateId, getCurrentTimeStamp, getKeyByProperty } from '../../../utils/function';
import { Context, actions } from '../../../contexts/Channel/ChannelContext';
import UploadFile from './UploadFile';
import Emoji from './Emoji';


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
    const [openUpload, setOpenUpload] = useState(false);
    // const [openEmoji, setOpenEmoji] = useState(false);

    const clearInput = () => reset();

    const sendInChannel = async (value) => {
        const messageId = generateId(userId, isChannel ? channelId : friendId, value.messageContent)
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
    }

    const sendInDirect = async (value) => {
        const messageId = generateId(userId, isChannel ? channelId : friendId, value.messageContent)
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
    const sendMessage = async value => {
        if(value.messageContent === '') return

        if (isChannel) {
            await sendInChannel(value);
        } else {
            await sendInDirect(value);
        }
        clearInput();
    }

    const openUploadFile = () => setOpenUpload(show => !show);

    // const openSendEmoji = () => setOpenEmoji(show => !show);

    return (
        <>
            <form 
                onSubmit={handleSubmit(sendMessage)}
                className="input_box"
            >
                <div className="additional_file" onClick={openUploadFile}>
                    <Plus />
                </div>
                {/* <div className="emoji_message" onClick={openSendEmoji}>
                    <Smile />
                </div> */}
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
                <UploadFile 
                    conversationId={conversationId}
                    open={openUpload}
                    userId={userId}
                    displayName={displayName}
                    avatar={avatar}
                    friendId={friendId}
                    isChannel={isChannel}
                    channelId={channelId}
                />
                {/* <Emoji 
                    open={openEmoji}
                /> */}
            </form>
            
        </>
    );
}

export default InputBox;