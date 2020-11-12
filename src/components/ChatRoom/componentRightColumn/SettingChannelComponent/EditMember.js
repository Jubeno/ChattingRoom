import React, { useContext, useEffect, useState } from 'react';
import { ChevronDown, PlusCircle, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import Popup from 'reactjs-popup';
import { Form, Input } from 'reactstrap';
import firebase from 'firebase';
import { Context as ChannelContext, actions as ChannelActions } from '../../../../contexts/Channel/ChannelContext';
import moment from 'moment';
import MemberItem from './MemberItem';
import AddMember from './AddMember';
import { DATABASE } from '../../../../utils/database';
import { Mention, MentionsInput } from 'react-mentions';
import { MESSAGE_TYPE } from '../../../../utils/constant';
import { generateId, getCurrentTimeStamp } from '../../../../utils/function';

const EditMember = props => {
    const { inforChannel, close, userId, closeMenu, user, member, isChannel } = props;
    const channelId = inforChannel.channelId;
    const isOwnerOfChannel = () => userId === inforChannel.createBy;
    const [listDisplay, setListDisplay] = useState([]);
    const [paramSearch, setParamSearch] = useState('');
    const [errorOnAdd, setErrorOnAdd] = useState({isError: false, name: ''});
    const currentTime = getCurrentTimeStamp();
    const messageId = generateId(userId, channelId, currentTime);

    const searchMember = event => {
        setParamSearch(event.target.value);
    }

    const isShowAddMember = () => {
        let isShow = false;
        if(inforChannel.isPrivate) {
            if(isOwnerOfChannel()) {
                isShow = true;
            } else {
                isShow = false;
            }
        } else {
            isShow = true;
        }
        
        return isShow;
    }

    const closeEditMember = () => {
        close();
        closeMenu();
    }

    useEffect(() => {
        const workspaceName = localStorage.getItem('workspace');
        async function getListUser() {
            await DATABASE
            .ref('/user/list')
            .orderByChild('workspace')
            .equalTo(workspaceName)
            .once('value', response => {
                const value = Object.values(response.val());
                const listToDisplay = value.map(item => ({
                    id: item.userID,
                    display: item.displayName
                }));
                setListDisplay(listToDisplay);
            })
        }
        getListUser();
    }, [])

    const onAdd = async (id, display) => {
        setParamSearch('');
        if(member.findIndex(item => item.userId === id) !== -1) {
            setErrorOnAdd({isError: true, name: display});
        } else {
            const data = {
                userId: id,
                name: display
            }
            await DATABASE
            .ref(`/userInChannel/${channelId}/members`)
            .child(id)
            .update(data)

            //send system message
            await DATABASE.ref(`/chatInChannel/${channelId}/listChat`).push().update({
                value: `${user.displayName} has added ${display} to this channel`,
                messageType: MESSAGE_TYPE.SYSTEM,
                sendTime: currentTime,
                senderId: userId,
                receiverId: channelId,
                messageId
            })
        }
    }

    const handleFocus = () => setErrorOnAdd({isError: false, name: ''})

    return (
        <>
            <Popup
                open={true}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                className="edit_member_popup"
            >
                <div className="top">
                    <div className="title">
                        Members
                    </div>
                    <X className="close_popup" size={35} onClick={closeEditMember}/>
                </div>
                {
                        isShowAddMember() &&
                            <div className="add_member">
                                <div className="add_icon">
                                    <PlusCircle size={50} color="#e6dede"/>
                                </div>
                                <div className="text">
                                    <MentionsInput 
                                        onChange={event => searchMember(event)} 
                                        className="mentions"
                                        value={paramSearch}
                                        markup="@{{__type__||__id__||__display__}}"
                                        placeholder="Enter @ to search and add new member"
                                        singleLine
                                        allowSpaceInQuery
                                        allowSuggestionsAboveCursor={false}
                                        onFocus={handleFocus}
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
                                </div>
                            </div>
                    }
                    {
                        errorOnAdd.isError && <p className="error_on_add">{errorOnAdd.name} has already exist on this channel</p>
                    }
                    <hr />
                <div className="bottom">
                    
                    
                    {
                        member.map((item, key) => 
                            <MemberItem key={key} data={item} userId={userId} inforChannel={inforChannel} user={user} channelId={channelId} isChannel={isChannel}/>
                        )
                    }
                </div>
                
            </Popup>
        </>
    );
}

export default EditMember;