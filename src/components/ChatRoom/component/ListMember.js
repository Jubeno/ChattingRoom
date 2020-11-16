import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import Popup from 'reactjs-popup';
import { Badge } from 'reactstrap';
import { MESSAGE_TYPE } from '../../../utils/constant';
import { DATABASE } from '../../../utils/database';
import { generateId, getCurrentTimeStamp } from '../../../utils/function';
import DelayImage from '../../Common/DelayImage/DelayImage';
import Loading from '../../Common/Loading/Loading';
import './ListMember.scss';

const ListMember = props => {
    const { close, userProfile, workspaceId, userId, workspaceName, openCreateNewUser } = props;
    const [ listMember, setListMember ] = useState([]);
    const [ listChannel, setListChannel ] = useState([]);
    const currentTime = getCurrentTimeStamp();

    useEffect(() => {
        async function getListUser() {
            await DATABASE
            .ref(`/user/list/`)
            .orderByChild('workspace')
            .equalTo(workspaceName)
            .once("value", response => {
                if(response.val()) {
                    const value = Object.values(response.val());
                    setListMember(value)
                }
            })
            await DATABASE
            .ref(`/userInChannel`)
            .orderByChild('workspaceId')
            .equalTo(workspaceId)
            .once("value", response => {
                if(response.val()) {
                    const value = Object.values(response.val());
                    setListChannel(value)
                }
            })
        }
        getListUser();
    }, []);

    const getAllChannelUserIsIn = userId => {
        let result = [];
        listChannel.map(item => {
            const isInChannel = Object.keys(item.members).findIndex(item => item === userId) !== -1;
            if(isInChannel) {
                result.push(item.channelId);
            }
        })
        return result;
    }

    const removeMember = async item => {
        const userIdToDelete = item.userID;
        const nameToDelete = item.displayName;
        const channelsUserIn = getAllChannelUserIsIn(userIdToDelete);

        // delete in direct message
        await DATABASE
        .ref(`/directMessage`)
        .orderByChild('friendId')
        .equalTo(userIdToDelete)
        .once('value', response => {
            if(response.val()) {
                const keyToRemove = Object.keys(response.val())[0];
                DATABASE.ref(`/directMessage`).child(keyToRemove).remove();
                DATABASE.ref(`/chatInDirectMessage`).child(keyToRemove).remove();
            }
        })
        
        // delete in user list
        await DATABASE
        .ref(`/user/list`)
        .orderByChild('userID')
        .equalTo(userIdToDelete)
        .once('value', response => {
            const keyToRemove = Object.keys(response.val())[0];
            DATABASE.ref(`/user/list/${keyToRemove}`).remove();
            channelsUserIn.map(channelId => {
                const messageId = generateId(userIdToDelete, channelId, currentTime);
                // DELETE USER IN CHANNEL
                DATABASE.ref(`/userInChannel/${channelId}/members/${userIdToDelete}`).remove();

                // SEND MESSAGE TO CHANNEL (AFTER DELETE USER IN CHANNEL)
                DATABASE.ref(`/chatInChannel/${channelId}/listChat`).push().update({
                    value: `${nameToDelete} has been deactived by Administrator`,
                    messageType: MESSAGE_TYPE.SYSTEM,
                    sendTime: currentTime,
                    senderId: userId,
                    receiverId: channelId,
                    messageId
                })
            })
        })

        setListMember(listMember.filter(item => item.userID !== userIdToDelete))
    }

    return (
        <>
            {
                listMember.length > 0 &&
                <Popup
                    open={true}
                    closeOnDocumentClick={false}
                    closeOnEscape={false}
                    className="list_member_popup"
                >
                    <div className="top">
                        <div className="title">
                            Members
                        </div>
                        <X className="close_popup" size={25} color="#fff" onClick={close}/>
                    </div>
                    <div className="bottom">
                        <p className="notice">NOTE: The delete function is only recommended when a member quits his / her job at the company</p>
                        <div className="list">
                            {
                                listMember.map((item, key) =>
                                    <div className="member_item" key={key}>
                                        <div className="left_item avatar">
                                            <DelayImage src={item.displayAvatar} alt="avatar"/>
                                        </div>
                                        <div className="right_item">
                                            <div className="infor">
                                                <div className="name">{item.displayName}</div>
                                                <div className="role">
                                                    {
                                                        item.isAdmin
                                                        ? <Badge pill color="danger">Admin</Badge>
                                                        : <Badge pill color="dark">Member</Badge>
                                                    }
                                                    {
                                                        item.userID === userId && <Badge pill color="dark" style={{ marginLeft: 5 }}>You</Badge>
                                                    }
                                                </div>
                                            </div>
                                            {
                                                item.userID !== userId &&
                                                    <div className="remove_member" onClick={() => removeMember(item)}>
                                                        Delete
                                                    </div>
                                            }
                                            
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </Popup>
            }
            
        </>
    );
}

export default ListMember;