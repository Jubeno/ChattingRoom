import React, { useContext, useEffect, useState } from 'react';
import TopBar from './componentRightColumn/TopBar';
import { Context as ChannelContext, actions as ChannelActions } from '../../contexts/Channel/ChannelContext';
import { channelOnDB, chatInChannelOnDB, userInChannelOnDB } from '../../utils/database';
import { GENERAL_CHANNEL_ID } from '../../utils/constant';
import ChatContent from './componentRightColumn/ChatContent';
import InputBox from './componentRightColumn/InputBox';
import IntroduceApp from './componentRightColumn/IntroduceApp';


const RightColumn = props => {
    const { channelData } = useContext(ChannelContext).state;
    const [ dataChannel, setDataChannel ] = useState({});

    // useEffect(() => {
    //     async function getInitialChannel() {
    //         let data = {};
    //         await channelOnDB.orderByChild('channelId').equalTo(GENERAL_CHANNEL_ID).once('value', response => {
    //             if( response.exists() ) {
    //                 data.infor = response.val() && Object.values(response.val())[0];
    //             }
    //         })
    //         await userInChannelOnDB.orderByChild('channelId').equalTo(GENERAL_CHANNEL_ID).once('value', response => {
    //             if( response.exists() ) {
    //                 data.members = response.val() && Object.values(response.val())[0].members;
    //             }
    //         })
    //         await chatInChannelOnDB.orderByChild('channelId').equalTo(GENERAL_CHANNEL_ID).once('value', response => {
    //             if( response.exists() ) {
    //                 data.listChat = response.val() && Object.values(response.val())[0].listChat;
    //             }
    //         })
    //         setDataChannel(data);
    //     }
    //     getInitialChannel();
    // }, [])

    const dataToFill = channelData.infor === null ? dataChannel : channelData;
    return (
        <>
            <div className="container_right">
                {
                    !channelData.isActive 
                        ? <IntroduceApp />
                        : 
                            <>
                                <TopBar data={dataToFill}/>
                                <ChatContent data={dataToFill}/>
                                <InputBox data={dataToFill} { ...props }/>
                            </>
                }
                
            </div>
        </>
    );
}

export default RightColumn;