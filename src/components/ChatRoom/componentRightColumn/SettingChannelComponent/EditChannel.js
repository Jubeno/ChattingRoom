import React, { useContext, useEffect, useState } from 'react';
import { ChevronDown } from 'react-feather';
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

const EditChannel = props => {
    const { inforChannel, close, userId, closeMenu, user } = props;
    // console.log('%c inforChannel: ', 'color: red' , inforChannel);
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

    const editChannelByCreator = async (data) => {
        await updateChannel.update({
            name: data.channelName,
            isPrivate: data.isPrivate
        })
        await updateUserInChannel.update({
            channelName: data.channelName,
            isPrivate: data.isPrivate
        })
        await DATABASE.ref(`/chatInChannel/${channelId}/listChat`).push().update({
            value: `${user.displayName} has changed this chanel profile`,
            messageType: MESSAGE_TYPE.SYSTEM,
            sendTime: currentTime,
            senderId: userId,
            receiverId: channelId,
            messageId
        })
        ChannelActions.editChannel({
            name: data.channelName,
            isPrivate: data.isPrivate,
        })
    }

    const editChannelByMember = async (data) => {
        await updateChannel.update({
            name: data.channelName,
        })
        await updateUserInChannel.update({
            channelName: data.channelName,
        })
        await DATABASE.ref(`/chatInChannel/${channelId}/listChat`).push().update({
            value: `${user.displayName} has changed this chanel profile`,
            messageType: MESSAGE_TYPE.SYSTEM,
            sendTime: currentTime,
            senderId: userId,
            receiverId: channelId,
            messageId
        })
        ChannelActions.editChannel({
            name: data.channelName,
        })
    }

    const editChannel = async data => {
        setLoading(true);

        if(isOwnerOfChannel()) {
            await editChannelByCreator(data)
        } else {
            await editChannelByMember(data)
        }

        setLoading(false);
        close();
        closeMenu();
    }

    // const cancel = () => closeCreateChannel();

    const handleChangeChannelName = event => {
        setChannelName(event.target.value);
    }

    
    return (
        <>
            { loading && <Loading /> }
            <Popup
                open={true}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                className="edit_channel_popup"
            >
                <Form onSubmit={handleSubmit(editChannel)} className="form_create_new_channel">
                    <h4>Edit your channel</h4>
                    <hr/>
                    <div className="channel_name">
                        <label>New channel name:</label>
                        <Input 
                            type="text"
                            name="channelName"
                            autoFocus={true}
                            placeholder="New channel name"
                            innerRef={register}
                            onChange={handleChangeChannelName}
                            defaultValue={inforChannel.name}
                        />
                    </div>
                    {
                        isOwnerOfChannel() &&
                            <div className="private_channel">
                                <label>Private:</label>
                                <div className="private_input">
                                    <Input 
                                        type="checkbox"
                                        name="isPrivate"
                                        innerRef={register}
                                        className="_input"
                                        defaultChecked={inforChannel.isPrivate}
                                    />
                                    <p className="private_notice">Note: If the channel is private, no one can add / remove members except the channel's creator. Some functions will be limited.</p>
                                </div>
                            </div>
                    }

                    <div className="button_create_new_channel">
                        <button className="cancel" onClick={close}>Cancel</button>
                        <button className="accept" type="submit" >Apply</button>
                    </div>
                </Form>
            </Popup>
        </>
    );
}

export default EditChannel;