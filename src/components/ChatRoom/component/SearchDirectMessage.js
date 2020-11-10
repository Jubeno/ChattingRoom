import React, { useState, useEffect, useContext } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { userOnDB, messageOnDB, directMessageOnDB } from '../../../utils/database';
import { generateId, getCurrentTimeStamp } from '../../../utils/function';
import { Context as DirectMessageContext, actions as DirectMessageActions } from '../../../contexts/DirectMessage/DirectMessageContext';
import { MESSAGE_TYPE } from '../../../utils/constant';

const SearchDirectMessage = props => {
    const { userProfile, userId, closeDirectMessage, workspaceId } = props;
    const [ paramSearch, setParamSearch ] = useState('');
    const { dataWorkspace, listDirectMessage } = useContext(DirectMessageContext).state;
    const [ listDisplay, setListDisplay ] = useState([]);

    const searchMember = event => {
        setParamSearch(event.target.value);
    }

    useEffect(() => {
        const listToDisplay = dataWorkspace?.user?.map(item => ({
            id: item.userID,
            display: item.displayName
        }));
        setListDisplay(listToDisplay);
    }, [])

    const onAdd = async id => {
        if(listDirectMessage.find(item => item.friendId === id)) {
            closeDirectMessage();
            return
        } else {
            const currentTime = getCurrentTimeStamp();
            const conversationID = generateId(userId, id, currentTime);
            const newConversation = directMessageOnDB.child(conversationID);
            const newMessage = messageOnDB.child(conversationID);
            
            const data = {
                conversationID,
                createdBy: userId,
                friendId: id,
                workspaceId,
                members: [userId, id]
            }
            await newConversation.set({
                conversationID,
                createdBy: userId,
                friendId: id,
                workspaceId,
                members: [userId, id]
            })
            await newMessage.set({
                conversationID,
                createdBy: userId,
                friendId: id,
                workspaceId,
                members: [userId, id],
                listChat: [
                    {                    
                        value: `${userProfile.displayName} created this conversation`,
                        messageType: MESSAGE_TYPE.SYSTEM
                    }
                ]
            })
            DirectMessageActions.createListDirectMessage(data);
            closeDirectMessage();
        }
    }

    const isNoMoreResultToSuggest = () => listDirectMessage?.length === dataWorkspace?.user?.length - 1

    return (
        <MentionsInput 
            onChange={event => searchMember(event)} 
            className="mentions"
            value={paramSearch}
            markup="@{{__type__||__id__||__display__}}"
            placeholder={`${isNoMoreResultToSuggest() ? "No more result ..." : '@name'}`}
            singleLine
            allowSpaceInQuery
            allowSuggestionsAboveCursor={false}
            disabled={isNoMoreResultToSuggest()}
        >
            <Mention
                type="user"
                trigger="@"
                data={listDisplay}
                className="mentions__mention"
                appendSpaceOnAdd
                onAdd={onAdd}
            />
        </MentionsInput>
    );
}

export default SearchDirectMessage;