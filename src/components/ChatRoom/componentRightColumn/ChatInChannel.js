import React, { useEffect, useState } from 'react';
import { chatInChannelOnDB, messageOnDB } from '../../../utils/database';
import MessageItem from './MessageItem';

const ChatInChannel = props => {
    const { data, userId } = props;
    const channelId = data?.infor?.channelId;
    const listChat = data?.listChat && Object.values(data?.listChat);
    const [ listRealTime, setListRealTime ] = useState([]);
    const [ initial, setInitial ] = useState(true);

    useEffect(() => {
        return () => setListRealTime([])
    }, [])

    // chat real time
    channelId && chatInChannelOnDB.orderByChild('channelId').equalTo(channelId).on('child_changed', response => {
        setInitial(false);
        const value = response.val() && Object.values(response.val().listChat);
        setListRealTime(value);
    })

    const loadList = initial ? listChat : listRealTime;
    return (
        <div className="chat_content">
            {
                loadList?.map((item, key) => <MessageItem key={key} data={item} userId={userId}/>)
            }
        </div>
    );
}

export default ChatInChannel;