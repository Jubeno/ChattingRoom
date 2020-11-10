import React from 'react';
import DelayImage from '../../Common/DelayImage/DelayImage';
import moment from 'moment';

const IMAGE = props => {
    const { data, userId } = props;
    const name = data.displayName;
    const content = data.value;
    const avatar = data.avatar !== '' ? data.avatar : '/img/avatar-placeholder.png';
    const getSendTime = format => {
        return moment(data.sendTime).format(format);
    }
    const isMyMessage = () => data.senderId === userId;
    const isToday = moment().diff(data.sendTime, 'days') === 0;
    const sendTime = isToday ? getSendTime('HH:mm') : getSendTime('HH:mm DD/MM/YYYY');
    const imageURL = data.url;
    
    const type = data.messageType;
    
    return (
        <>
            <div id={type} className={`${isMyMessage() ? 'my_message_item' : 'other_message_item'}`}>
                <div className={`${isMyMessage() ? 'my_message' : 'other_message'}`}>
                    <div className="avatar">
                        <DelayImage src={avatar}  />
                    </div>
                    <div className="content">
                        <div>
                            <div className="name">{name}</div>
                            <div className="message_content">
                                <a href={imageURL} target="_blank">
                                    <img src={imageURL}/>
                                </a>
                            </div>
                        </div>
                        <div className="sendtime">
                            {sendTime}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default IMAGE;