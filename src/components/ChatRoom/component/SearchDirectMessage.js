import React, { useState, useEffect, useContext } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { userOnDB, messageOnDB, directMessageOnDB } from '../../../utils/database';
import { generateId, getCurrentTimeStamp } from '../../../utils/function';
import { Context as DirectMessageContext, actions as DirectMessageActions } from '../../../contexts/DirectMessage/DirectMessageContext';

const SearchDirectMessage = props => {
    const { userId, closeDirectMessage, workspaceId } = props;
    const [ paramSearch, setParamSearch ] = useState('');
    const { dataWorkspace, listDirectMessage } = useContext(DirectMessageContext).state;
    console.log('%c listDirectMessage: ', 'color: red' , listDirectMessage);
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
            const newConversation = directMessageOnDB.push();
            const newMessage = messageOnDB.push();
            const currentTime = getCurrentTimeStamp();
            const conversationID = generateId(userId, id, currentTime);
            const data = {
                conversationID,
                createdBy: userId,
                friendId: id,
                workspaceId
            }
            await newConversation.set(data)
            await newMessage.set(data)
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