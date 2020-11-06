import React, { useState, useEffect, useContext } from 'react';
import { directMessageOnDB, getData, messageOnDB, userOnDB } from '../../../utils/database';
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

            await directMessageOnDB.orderByChild('createdBy').equalTo(userId).once('value', response => {
                if ( response.exists() ) {
                    const value = Object.values(response.val());
                    listDirect = value;
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
    }

    const openDirectMessage = async item => {
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

    return (
        <>
            {
                listDirect?.length > 0 && listDirect?.map((item, key) =>
                    <div className="direct_message_item" key={key}>
                        <p onClick={() => openDirectMessage(item)}>{getUserNameById(item?.friendId)}</p>
                        <X 
                            onClick={() => deleteConversation(item)}
                            className="delete_conversation" 
                            color="#fff" 
                            size={18}
                        />
                    </div>
                )
            }
        </>
        
    );
}

export default ListDirectMessage;