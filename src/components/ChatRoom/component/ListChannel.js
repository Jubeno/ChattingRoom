import React, { useContext, useEffect, useState } from 'react';
import { X } from 'react-feather';
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
    }

    const isNotGeneralChannel = (item) => item.channelId !== GENERAL_CHANNEL_ID;

    const openChannel = async item => {
        const startTime = moment().subtract(65, 'minutes').valueOf();

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
        // .orderByChild('sendTime')
        // .startAt(startTime)
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

    const isUserInChannel = (channel) => channel?.members?.includes(userId);
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
                                : null
                            }
                        )
                }
            </div>
        </>
    );
}

export default ListChannel;