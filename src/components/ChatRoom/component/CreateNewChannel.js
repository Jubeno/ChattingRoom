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

const CreateNewChannel = props => {
    const { closeCreateChannel, userId } = props;
    const { register, handleSubmit } = useForm();
    const [ members, setMembers ] = useState([]);
    const [ listUser, setListUser ] = useState([]);
    const [ paramSearch, setParamSearch ] = useState('');
    const [ channelName, setChannelName ] = useState('');
    const userOnDB = firebase.database().ref('/user/list');
    const channelOnDB = firebase.database().ref('/listChannel');
    const userInChannel = firebase.database().ref('/userInChannel');
    const createTime = moment().valueOf();
    const [ loading, setLoading ] = useState(false);
    
    const createNewChannel = async data => {
        setLoading(true);
        
        const newChannel = channelOnDB.push();
        const newUserInChannel = userInChannel.push();
        const channelId = btoa(`${data.channelName}-${createTime}`);

        await newChannel.set({
            name: data.channelName,
            createTime,
            channelId
        })
        await newUserInChannel.set({
            members,
            channelId,
            channelName: data.channelName
        })
        ChannelActions.createChannel({
            name: data.channelName,
            createTime,
            channelId
        })
        setLoading(false);
        closeCreateChannel();
    }

    // get list suggestion
    useEffect(() => {
        userOnDB.once('value', response => {
            const valueOnDB = Object.values(response.val());
            setListUser(valueOnDB)
        })
    }, [])

    const cancel = () => closeCreateChannel();

    const searchMember = event => {
        setParamSearch(event.target.value);
    };

    const onAdd = id => {
        setMembers([...members, id])
    }

    const listToDisplay = listUser.length > 0 && listUser.map(item => ({
        id: item.userID,
        display: item.displayName
    }))

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
                                data={listToDisplay}
                                className="mentions__mention"
                                appendSpaceOnAdd
                                onAdd={onAdd}
                            />
                        </MentionsInput>
                    </div>
                    <div className="button_create_new_channel">
                        <button className="cancel" onClick={cancel}>Cancel</button>
                        <button className="accept" disabled={!handleDisabledCreateButton()}>Create</button>
                    </div>
                </Form>
            </Popup>
        </>
    );
}

export default CreateNewChannel;