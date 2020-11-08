import React, { useEffect } from 'react';
import DelayImage from '../../Common/DelayImage/DelayImage';
import moment from 'moment';

const MessageItem = props => {
    const { data, userId } = props;
    console.log('userId: ', data);
    const name = data.displayName;
    const content = data.value;
    const avatar = data.avatar !== '' ? data.avatar : '/img/avatar-placeholder.png';
    const sendTime = moment(data.sendTime).format('HH:mm DD/MM/YYYY');
    console.log('sendTime: ', sendTime);
    const isMyMessage = () => data.senderId === userId;

    useEffect(() => {

    }, [])

    return (
        <div className="message_item">
            <div className="avatar">
                <DelayImage src={avatar}  />
            </div>
            <div className="content">
                <div className="name">{name}</div>
                <div className="message_content">
                    {content}
                </div>
                <div className="sendtime">
                    {sendTime}
                </div>
            </div>
        </div>
    );
}

export default MessageItem;