import React from 'react';
import { useHistory } from 'react-router-dom';

const ChatRoom = props => {
    const userId = props.match.params.id;
    const history = useHistory();
    
    return (
        <>
            Chat room
        </>
    );
}

export default ChatRoom;