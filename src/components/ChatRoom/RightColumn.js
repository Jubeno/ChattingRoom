import React, { useContext, useEffect, useState } from 'react';
import TopBar from './componentRightColumn/TopBar';
import { Context as ChannelContext, actions as ChannelActions } from '../../contexts/Channel/ChannelContext';
import ChatInChannel from './componentRightColumn/ChatInChannel';
import InputBox from './componentRightColumn/InputBox';
import IntroduceApp from './componentRightColumn/IntroduceApp';
import ChatInDirectMessage from './componentRightColumn/ChatInDirectMessage';


const RightColumn = props => {
    const { userId } = props;
    const { channelData } = useContext(ChannelContext).state;
    const isChannel = channelData.type === 'CHANNEL';
    const dataToFill = channelData;
    return (
        <>
            <div className="container_right">
                {
                    !channelData.isActive 
                        ? <IntroduceApp />
                        : 
                            <>
                                <TopBar data={dataToFill}/>
                                {
                                    isChannel 
                                        ? <ChatInChannel userId={userId} data={dataToFill}/> 
                                        : <ChatInDirectMessage userId={userId} data={dataToFill}/>
                                }
                                <InputBox data={dataToFill} { ...props }/>
                            </>
                }
                
            </div>
        </>
    );
}

export default RightColumn;