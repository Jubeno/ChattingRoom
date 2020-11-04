import React, { useContext } from 'react';
import { Send, Smile } from 'react-feather';
import { useForm } from 'react-hook-form';
import { channelOnDB } from '../../../utils/database';
import { generateId, getCurrentTimeStamp, getKeyByProperty } from '../../../utils/function';

const InputBox = props => {
    const { user, data } = props;
    console.log('%c data: ', 'color: red' , data);
    const { register, handleSubmit, reset } = useForm();
    const currentTime = getCurrentTimeStamp();
    const userId = user.userID;
    const channelId = data?.infor?.channelId;


    const clearInput = () => reset();

    const sendMessage = async value => {
        const messageId = generateId(userId, channelId, value.messageContent)
        await channelOnDB.once('value', response => {
            const key = getKeyByProperty( response.val(), 'channelId', channelId)
            const newMessage = channelOnDB.child(`${key}/listChat`).push();

            newMessage.update({
                value: value.messageContent,
                sendTime: currentTime,
                senderId: userId,
                receiverId: channelId,
                messageId
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