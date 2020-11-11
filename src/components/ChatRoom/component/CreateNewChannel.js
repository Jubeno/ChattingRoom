import React, { useContext, useEffect, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { useForm } from 'react-hook-form';
import Popup from 'reactjs-popup';
import { Form, Input } from 'reactstrap';
import './CreateNewChannel.scss';
import SearchMember from './SearchMember';
import firebase from 'firebase';
import { Context as ChannelContext, actions as ChannelActions } from '../../../contexts/Channel/ChannelContext';
import { MentionsInput, Mention } from 'react-mentions'
import moment from 'moment';
import Loading from '../../Common/Loading/Loading';
import { channelOnDB, chatInChannelOnDB, userInChannelOnDB, userOnDB } from '../../../utils/database';
import { Context as DirectMessageContext, actions as DirectMessageActions } from '../../../contexts/DirectMessage/DirectMessageContext';
import { getCurrentTimeStamp } from '../../../utils/function';
import { MESSAGE_TYPE } from '../../../utils/constant';

const CreateNewChannel = props => {
    const { userProfile, closeCreateChannel, userId, workspaceId, workspaceName } = props;
    const { register, handleSubmit } = useForm();
    const [ members, setMembers ] = useState([userId]);
    const [ listUser, setListUser ] = useState([]);
    const [ paramSearch, setParamSearch ] = useState('');
    const [ channelName, setChannelName ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ listDisplay, setListDisplay ] = useState([]);
    const createTime = getCurrentTimeStamp();
    const { dataWorkspace } = useContext(DirectMessageContext).state;


    const createNewChannel = async data => {
        setLoading(true);
        const channelId = btoa(`${data.channelName}-${createTime}`);
        const newChannel = channelOnDB.child(channelId);
        const newUserInChannel = userInChannelOnDB.child(channelId);
        const newListChat = chatInChannelOnDB.child(channelId);
        
        await newChannel.set({
            name: data.channelName,
            createTime,
            channelId,
            workspaceId,
            createBy: userId,
            isPrivate: data.isPrivate
        })
        await newUserInChannel.set({
            members,
            channelId,
            channelName: data.channelName,
            workspaceId,
            createBy: userId,
            isPrivate: data.isPrivate
        })
        await newListChat.set({
            name: data.channelName,
            channelId,
            workspaceId,
            listChat: [
                {                    
                    value: `${userProfile.displayName} created this ${data.isPrivate ? 'private' : ''} channel`,
                    messageType: MESSAGE_TYPE.SYSTEM
                }
            ]
        })
        ChannelActions.createChannel({
            members,
            channelId,
            channelName: data.channelName,
            workspaceId,
            createBy: userId,
            isPrivate: data.isPrivate
        })
        setLoading(false);
        closeCreateChannel();
    }

    // get list suggestion
    useEffect(() => {
        userOnDB.orderByChild('workspace').equalTo(workspaceName).once('value', response => {
            const valueOnDB = Object.values(response.val());
            setListUser(valueOnDB)
        })
    }, [])

    useEffect(() => {
        // let filterCurrentAccount = dataWorkspace?.user?.filter(item => item.userID !== userId );
        // const result = filterCurrentAccount.slice(members.length)
        // const listToDisplay = result.map(item => ({
        //     id: item.userID,
        //     display: item.displayName
        // }));

        // setListDisplay(listToDisplay);
        const listToDisplay = dataWorkspace?.user?.map(item => ({
            id: item.userID,
            display: item.displayName
        }));
        setListDisplay(listToDisplay);
    }, [])

    const cancel = () => closeCreateChannel();

    const searchMember = event => {
        setParamSearch(event.target.value);
    };

    const onAdd = id => {
        if(id === userId) return;
        if(members.includes(id)) return;
        setMembers([...members, id])
    }

    const handleChangeChannelName = event => {
        setChannelName(event.target.value);
    }

    const handleDisabledCreateButton = () => {
        return channelName.length > 0 && members.length > 0
    }

    return (
        <>
            { loading && <Loading /> }
            <Popup
                open={true}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                className="create_new_channel_popup"
            >
                <Form onSubmit={handleSubmit(createNewChannel)} className="form_create_new_channel">
                    <h4>Create new channel</h4>
                    <hr/>
                    <div className="channel_name">
                        <label>Channel name:</label>
                        <Input 
                            type="text"
                            name="channelName"
                            autoFocus={true}
                            placeholder={'Benoo\'s channel'}
                            innerRef={register}
                            onChange={handleChangeChannelName}
                        />
                    </div>
                    <div className="member_of_channel">
                        <label>Members:</label>
                        <div className="member_input">
                            <MentionsInput 
                                onChange={event => searchMember(event)} 
                                className="mentions"
                                value={paramSearch}
                                markup="@{{__type__||__id__||__display__}}"
                                placeholder="@Benoo"
                                singleLine
                                allowSpaceInQuery
                                allowSuggestionsAboveCursor={false}
                            >
                                <Mention
                                    type="user"
                                    trigger="@"
                                    data={listDisplay}
                                    className="mentions__mention"
                                    appendSpaceOnAdd
                                    onAdd={onAdd}
                                />
                            </MentionsInput>
                            <p className="member_notice">Note: All duplicate members will be removed</p>
                        </div>
                        
                    </div>
                    <div className="private_channel">
                        <label>Private:</label>
                        <div className="private_input">
                            <Input 
                                type="checkbox"
                                name="isPrivate"
                                innerRef={register}
                                className="_input"
                            />
                            <p className="private_notice">Note: If the channel is private, no one can add / remove members except the channel's creator. Some functions will be limited.</p>
                        </div>
                        
                    </div>
                    <div className="button_create_new_channel">
                        <button className="cancel" onClick={cancel}>Cancel</button>
                        <button className="accept" type="submit" disabled={!handleDisabledCreateButton()}>Create</button>
                    </div>
                </Form>
            </Popup>
        </>
    );
}

export default CreateNewChannel;