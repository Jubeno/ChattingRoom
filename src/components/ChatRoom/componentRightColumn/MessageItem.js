import React, { useEffect, useState } from 'react';
import { MESSAGE_TYPE } from '../../../utils/constant';
import { userOnDB } from '../../../utils/database';
import FILE from '../../Common/Message/FILE';
import IMAGE from '../../Common/Message/IMAGE';
import SYSTEM from '../../Common/Message/SYSTEM';
import TEXT from '../../Common/Message/TEXT';
import VIDEO from '../../Common/Message/VIDEO';


const MessageItem = props => {
    const { data, userId } = props;
    const [avatar, setAvatar] = useState('');
    useEffect(() => {
        async function getDataFromDB() {
            await userOnDB.orderByChild('userID').equalTo(userId)
            .once('value', response => {
                if(response.val()) {
                    const value = Object.values(response.val())[0].displayAvatar;
                    setAvatar(value);
                }
            })
            
        }
        getDataFromDB();
    })

    const renderMessageType = () => {
        let messageItem = <div>Can't load message, please reload this page</div>;
        switch (data.messageType) {
            case MESSAGE_TYPE.TEXT:
                messageItem = <TEXT data={data} avatar={avatar} userId={userId}/>
                break;
            case MESSAGE_TYPE.SYSTEM:
                messageItem = <SYSTEM data={data} avatar={avatar} userId={userId}/>
                break;
            case MESSAGE_TYPE.FILE:
                messageItem = <FILE data={data} avatar={avatar} userId={userId}/>
                break;
            case MESSAGE_TYPE.IMAGE:
                messageItem = <IMAGE data={data} avatar={avatar} userId={userId}/>
                break;
            case MESSAGE_TYPE.VIDEO:
                messageItem = <VIDEO data={data} avatar={avatar} userId={userId}/>
                break;
            
            default:
                break;
        }
        return messageItem;
    }

    return (
        <>
            {renderMessageType()}
        </>
    );
}

export default MessageItem;