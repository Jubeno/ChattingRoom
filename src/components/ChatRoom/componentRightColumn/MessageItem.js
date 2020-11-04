import React from 'react';
import DelayImage from '../../Common/DelayImage/DelayImage';

const MessageItem = () => {

    return (
        <div className="message_item">
            <div className="avatar">
                <DelayImage />
            </div>
            <div className="content">
                <div className="name">name</div>
                <div className="message_content">
                    Alooooo
                </div>
            </div>
        </div>
    );
}

export default MessageItem;