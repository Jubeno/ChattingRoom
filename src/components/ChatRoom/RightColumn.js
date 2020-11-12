import React, { useContext, useEffect, useState } from 'react';
import TopBar from './componentRightColumn/TopBar';
import { Context as ChannelContext, actions as ChannelActions } from '../../contexts/Channel/ChannelContext';
import ChatInChannel from './componentRightColumn/ChatInChannel';
import InputBox from './componentRightColumn/InputBox';
import IntroduceApp from './componentRightColumn/IntroduceApp';
import ChatInDirectMessage from './componentRightColumn/ChatInDirectMessage';
import { DATABASE } from '../../utils/database';


const RightColumn = props => {
    const { userId, user, workspace } = props;
    const { channelData } = useContext(ChannelContext).state;
   
    const isChannel = channelData.type === 'CHANNEL';
    const dataToFill = channelData;
    const channelId = channelData?.infor?.channelId || '' ;
    const [data, setData] = useState({})

    useEffect(() => {
        setData(channelData);
    }, [channelData])

    // update infor channel
    DATABASE
    .ref(`/listChannel`)
    .orderByChild('channelId')
    .equalTo(channelId)
    .on('child_changed', response => {
        const value = response.val();
        const dataTemp = {...data};
        dataTemp.infor.name = value.name;
        dataTemp.infor.isPrivate = value.isPrivate;
        setData(dataTemp);
    })

    return (
        <>
            <div className="container_right">
                {
                    !channelData.isActive 
                        ? <IntroduceApp />
                        : 
                            <>
                                <TopBar userId={userId} data={data} user={user} channelId={channelId}/>
                                {
                                    isChannel 
                                        ? <ChatInChannel userId={userId} data={data}/> 
                                        : <ChatInDirectMessage userId={userId} data={data}/>
                                }
                                <InputBox data={data} { ...props }/>
                            </>
                }
                
            </div>
        </>
    );
}

export default RightColumn;