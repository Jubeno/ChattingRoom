import React, { useContext, useEffect, useState } from 'react';
import { ChevronDown, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import Popup from 'reactjs-popup';
import { Form, Input } from 'reactstrap';
import firebase from 'firebase';
import { Context as ChannelContext, actions as ChannelActions } from '../../../../contexts/Channel/ChannelContext';
import moment from 'moment';
import Loading from '../../../Common/Loading/Loading';
import { channelOnDB, chatInChannelOnDB, DATABASE, userInChannelOnDB, userOnDB } from '../../../../utils/database';
import { Context as DirectMessageContext, actions as DirectMessageActions } from '../../../../contexts/DirectMessage/DirectMessageContext';
import { generateId, getCurrentTimeStamp } from '../../../../utils/function';
import { MESSAGE_TYPE } from '../../../../utils/constant';
import MemberItem from './MemberItem';

const EditMember = props => {
    const { inforChannel, close, userId, closeMenu, user, members } = props;
    const channelId = inforChannel.channelId;
    const { register, handleSubmit } = useForm();
    const [ channelName, setChannelName ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const currentTime = getCurrentTimeStamp();
    const updateChannel = channelOnDB.child(channelId);
    const updateUserInChannel = userInChannelOnDB.child(channelId);
    const newMessageChatInChannel = chatInChannelOnDB.child(channelId);
    const messageId = generateId(userId, channelId, currentTime);

    const isOwnerOfChannel = () => userId === inforChannel.createBy;

    return (
        <>
            { loading && <Loading /> }
            <Popup
                open={true}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                className="edit_member_popup"
            >
                <div className="title">
                    Members
                </div>
                <div className="add_member">
                    <div className="add_icon">
                        <PlusCircle size={50} color="#e6dede"/>
                    </div>
                    <div className="text">
                        Add member
                    </div>
                </div>
                {
                    members.map((item, key) => 
                        <MemberItem key={key} data={item} channelId={channelId}/>
                    )
                }
            </Popup>
        </>
    );
}

export default EditMember;