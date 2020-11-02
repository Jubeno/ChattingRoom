import React, { useState, useEffect, useContext } from 'react';
import { directMessageOnDB } from '../../../utils/database';
import { Context as GeneralContext, actions as GeneralActions } from '../../../contexts/General/GeneralContext';
import { X } from 'react-feather';
import { getKeyByProperty } from '../../../utils/function';

const ListDirectMessage = () => {
    const { listDirectMessage } = useContext(GeneralContext).state;
    const [ listDirect, setListDirect ] = useState(listDirectMessage);
    const { dataWorkspace } = useContext(GeneralContext).state;

    useEffect(() => {
        setListDirect(listDirectMessage);
    }, [listDirectMessage])

    useEffect(() => {
        async function getDataFromDB() {
            let listDirect = [];

            await directMessageOnDB.once('value', response => {
                if ( response.exists() ) {
                    const value = Object.values(response.val());
                    listDirect = value;
                }
            })
            
            setListDirect(listDirect);
            GeneralActions.createInitialListDirectMessage(listDirect);
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
        GeneralActions.deleteConversation(item.conversationID);
    }

    return (
        <>
            {
                listDirect?.length > 0 && listDirect?.map((item, key) =>
                    <div className="direct_message_item" key={key}>
                        <p>{getUserNameById(item?.friendId)}</p>
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