import React, { useEffect } from 'react';
import DelayImage from '../../Common/DelayImage/DelayImage';

const MessageItem = props => {
    const { data } = props;
    const name = data.displayName;
    const content = data.value;
    const avatar = data.avatar;

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
            </div>
        </div>
    );
}

export default MessageItem;