import React, { useContext, useEffect, useState } from 'react';
import { X } from 'react-feather';
import { getKeyByProperty } from '../../../utils/function';
import { GENERAL_CHANNEL_ID } from '../../../utils/constant';
import { channelOnDB, userInChannelOnDB } from '../../../utils/database';
import { Context as ChannelContext, actions as ChannelActions } from '../../../contexts/Channel/ChannelContext';

const ListChannel = () => {
    const { listChannel } = useContext(ChannelContext).state;
    const [ channels, setChannels ] = useState(listChannel);

    useEffect(() => {
        setChannels(listChannel);
    }, [listChannel]);

    useEffect(() => {
        async function getDataFromDB() {
            let channels = [];
            await channelOnDB.once('value', response => {
                channels = Object.values(response.val());
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
            const key = getKeyByProperty(response.val(), 'channelId', item.channelId);
            userInChannelOnDB.child(key).remove();
        })

        ChannelActions.deleteChannel(item.channelId);
    }

    const isNotGeneralChannel = (item) => item.channelId !== GENERAL_CHANNEL_ID;

    return (
        <>
            <div>
                {
                    channels.length > 0 && 
                        channels?.map((item, key) => 
                            <div className="channel_item" key={key}>
                                <p>{item.name}</p>
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
                        )
                }
            </div>
        </>
    );
}

export default ListChannel;