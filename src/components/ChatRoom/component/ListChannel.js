import React, { useContext, useEffect, useState } from 'react';
import { Lock, X } from 'react-feather';
import { getKeyByProperty } from '../../../utils/function';
import { GENERAL_CHANNEL_ID, INITIAL_MESSAGE_CHAT } from '../../../utils/constant';
import { channelOnDB, chatInChannelOnDB, userInChannelOnDB, userOnDB, DATABASE } from '../../../utils/database';
import { Context as ChannelContext, actions as ChannelActions } from '../../../contexts/Channel/ChannelContext';
import firebase from 'firebase';
import moment from 'moment';


const ListChannel = props => {
    const { workspaceId, userId } = props;
    const { listChannel } = useContext(ChannelContext).state;
    const [ channels, setChannels ] = useState(listChannel);
    
    // update when edit channel's profile
    DATABASE
    .ref('/listChannel')
    .orderByChild('workspaceId')
    .equalTo(workspaceId)
    .on('child_changed', response => {
        if(listChannel.length === 0) {
            return
        } else {
            const value = response.val();
            const channelNeedUpdateId = value.channelId;
            const channelNeedUpdate = listChannel?.find(item => item.channelId === channelNeedUpdateId) ;
            const channelRemain = listChannel.filter(item => item.channelId !== channelNeedUpdateId);
            if(channelNeedUpdate) {
                channelNeedUpdate.channelName = value.name;
                channelNeedUpdate.isPrivate = value.isPrivate;
            }
            setChannels([channelNeedUpdate, ...channelRemain])
        }
    })

    // update when user leave room or admin delete user to channel
    DATABASE
    .ref(`/userInChannel`)
    .orderByChild('workspaceId')
    .equalTo(workspaceId)
    .on('child_changed', response => {
        if(listChannel.length === 0) {
            return
        } else {
            const value = response.val();
            if(value) {
                const channelNeedUpdateId = value.channelId;
                const channelNeedUpdate = listChannel?.find(item => item.channelId === channelNeedUpdateId) ;
                const channelRemain = listChannel.filter(item => item.channelId !== channelNeedUpdateId);
                if(channelNeedUpdate) {
                    channelNeedUpdate.members = value.members;
                }
                setChannels([channelNeedUpdate, ...channelRemain])
            }
        }
    })
    

    useEffect(() => {
        setChannels(listChannel);
    }, [listChannel]);

    useEffect(() => {
        async function getDataFromDB() {
            let channels = [];
            await userInChannelOnDB.orderByChild('workspaceId').equalTo(workspaceId).once('value', response => {
                channels = response.val() ? Object.values(response.val()) : [];
            })
            setChannels(channels);
            ChannelActions.setInitialListChannel(channels);
        }
        getDataFromDB();
    }, []);

    const deleteChannel = async item => {
        await channelOnDB.once('value', response => {
            const key = getKeyByProperty(response.val(), 'channelId', item.channelId);
            channelOnDB.child(key).remove();
        });

        await userInChannelOnDB.once('value', response => {
            const key = response.val() && getKeyByProperty(response.val(), 'channelId', item.channelId);
            userInChannelOnDB.child(key).remove();
        })

        await chatInChannelOnDB.once('value', response => {
            const key = getKeyByProperty(response.val(), 'channelId', item.channelId);
            chatInChannelOnDB.child(key).remove();
        })
        ChannelActions.deleteChannel(item.channelId);
        ChannelActions.hideChatContent();
    }

    const isNotGeneralChannel = (item) => item.channelId !== GENERAL_CHANNEL_ID;

    const openChannel = async item => {
        localStorage.setItem('channelId', item.channelId);

        let data = {};
        data.type = "CHANNEL";
        await DATABASE.ref(`/listChannel/${item.channelId}`).once('value', response => {
            if(response.exists()) {
                data.infor = response.val();
            }
        })
        
        await DATABASE.ref(`/userInChannel/${item.channelId}`).once('value', response => {
            if( response.exists()) {
                data.members = Object.values(response.val().members);
            }
        })

        await DATABASE.ref(`/chatInChannel/${item.channelId}/listChat`)
        .limitToLast(INITIAL_MESSAGE_CHAT)
        .once('value', response => {
            if( response.val() ) {
                data.listChat = Object.values(response.val());
            } else {
                data.listChat = [];
            }
        })
        ChannelActions.setInformation(data);
    }

    const isUserInChannel = (channel) => {
        const members = Object.values(channel?.members);
        return members.findIndex(item => item.userId === userId) !== -1
    };

    return (
        <>
            <div>
                {
                    channels?.length > 0 && 
                        channels?.map((item, key) => {
                            return isUserInChannel(item) ?
                                <div className="channel_item" key={key}>
                                    <p 
                                        className="channel_name"
                                        onClick={() => openChannel(item)}
                                    >
                                        {item.channelName}
                                    </p>
                                    <div className="icon">
                                        {
                                            item?.isPrivate &&
                                                <Lock 
                                                    color="#fff" 
                                                    size={18}
                                                />
                                        }
                                        {
                                            isNotGeneralChannel(item) &&
                                                <X 
                                                    onClick={() => deleteChannel(item)}
                                                    className="delete_channel" 
                                                    color="#fff" 
                                                    size={18}
                                                />
                                        }
                                    </div>
                                </div>
                                : null
                            }
                        )
                }
            </div>
        </>
    );
}

export default ListChannel;