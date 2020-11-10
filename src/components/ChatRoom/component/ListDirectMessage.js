import React, { useState, useEffect, useContext } from 'react';
import { DATABASE, directMessageOnDB, getData, messageOnDB, userOnDB } from '../../../utils/database';
import { Context as DirectMessageContext, actions as DirectMessageActions } from '../../../contexts/DirectMessage/DirectMessageContext';
import { X } from 'react-feather';
import { getKeyByProperty } from '../../../utils/function';
import { Context as ChannelContext, actions as ChannelActions } from '../../../contexts/Channel/ChannelContext';

const ListDirectMessage = props => {
    const { userId } = props;
    const { listDirectMessage } = useContext(DirectMessageContext).state;
    const [ listDirect, setListDirect ] = useState(listDirectMessage);
    const { dataWorkspace } = useContext(DirectMessageContext).state;

    useEffect(() => {
        setListDirect(listDirectMessage);
    }, [listDirectMessage])

    useEffect(() => {
        async function getDataFromDB() {
            let listDirect = [];

            await DATABASE.ref('/directMessage').once('value', response => {
                if ( response.val() ) {
                    const value = Object.values(response.val());
                    listDirect = value;
                } else {
                    listDirect = [];
                }
            })
            
            setListDirect(listDirect);
            DirectMessageActions.createInitialListDirectMessage(listDirect);
        }
        getDataFromDB();
    }, []);

    const getUserNameById = (friendId) => {
        return dataWorkspace?.user?.find(item => item.userID === friendId)?.displayName;
    }

    const deleteConversation = async item => {
        await directMessageOnDB.once('value', response => {
            const key = getKeyByProperty(response.val(), 'conversationID', item.conversationID);
            directMessageOnDB.child(key).remove();
        })
        await messageOnDB.once('value', response => {
            const key = getKeyByProperty(response.val(), 'conversationID', item.conversationID);
            messageOnDB.child(key).remove();
        })
        DirectMessageActions.deleteConversation(item.conversationID);
        ChannelActions.hideChatContent();
    }

    const openDirectMessage = async item => {
        localStorage.setItem('friendId', item.friendId);
        let data = {};
        const dataConversation = await getData(messageOnDB, 'conversationID', item.conversationID);
        const dataFriend = await getData(userOnDB, 'userID', item.friendId);
        data = {
            type: "DIRECT_MESSAGE",
            infor: dataFriend[0],
            listChat: dataConversation[0].listChat || [],
            conversationId: item.conversationID,
            friendId: item.friendId,
            members: [userId, item.friendId]
        }
        ChannelActions.setInformation(data);
    }
    
    const isUserInConversation = (conversation) => {
        return conversation?.members?.includes(userId);
    }

    DATABASE
    .ref(`/directMessage`)
    .on('child_removed', response => {
        let value;
        if(response.val()) {
            value = response.val().conversationID;
        }
        const newListDirect = listDirect.filter(item => item.conversationID !== value);
        setListDirect(newListDirect)
    })
    
    DATABASE
    .ref(`/directMessage`)
    .on('child_added', response => {
        if(listDirect.length > 0) {return}
        else {
            let value;
            if(response.val()) {
                value = response.val();
            }
    
            const newListDirect = listDirect.findIndex(item => item.conversationID);
            if(newListDirect === -1) {
                setListDirect([...listDirect, value])
            }
        }
    })
    return (
        <>
            {
                listDirect?.length > 0 && listDirect?.map((item, key) => {
                    return isUserInConversation(item) 
                    ?
                        <div className="direct_message_item" key={key}>
                            <p onClick={() => openDirectMessage(item)}>{getUserNameById(item?.friendId)}</p>
                            <X 
                                onClick={() => deleteConversation(item)}
                                className="delete_conversation" 
                                color="#fff" 
                                size={18}
                            />
                        </div>
                    : null
                    }
                )
            }
        </>
        
    );
}

export default ListDirectMessage;