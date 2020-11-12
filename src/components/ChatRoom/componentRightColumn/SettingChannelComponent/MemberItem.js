import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import { Badge } from 'reactstrap';
import { MESSAGE_TYPE } from '../../../../utils/constant';
import { DATABASE } from '../../../../utils/database';
import { generateId, getCurrentTimeStamp } from '../../../../utils/function';

const MemberItem = props => {
    const { data, channelId, userId, inforChannel, isChannel, user } = props;
    const isOwnerOfChannel = () => data.userId === inforChannel.createBy;
    const creatorAccount = () => userId === inforChannel.createBy;
    const name = data?.name;

    const currentTime = getCurrentTimeStamp();
    const messageId = generateId(userId, channelId, currentTime);

    const getKeyToRemove = (object, value) => {
        return Object.keys(object).find(key => object[key].userId === value.userId)
    }

    const removeMember = async () => {
        await DATABASE
        .ref(`/userInChannel/${channelId}/members`)
        .once('value', response => {
            const value = response.val();
            if(value) {
                const key = getKeyToRemove(value, data);
                DATABASE.ref(`/userInChannel/${channelId}/members`).child(key).remove();
            }
        })
        
        //send system message
        await DATABASE.ref(`/chatInChannel/${channelId}/listChat`).push().update({
            value: `${user.displayName} has removed ${name} from this channel`,
            messageType: MESSAGE_TYPE.SYSTEM,
            sendTime: currentTime,
            senderId: userId,
            receiverId: channelId,
            messageId
        })
    }

    const isShowRemoveMember = () => {
        let isShow = false;
        if(creatorAccount()) {
            if(inforChannel.isPrivate) {
                if(isOwnerOfChannel()) {
                    isShow = false;
                } else {
                    isShow = true;
                }
            } else {
                if(isOwnerOfChannel()) {
                    isShow = false;
                } else {
                    isShow = true;
                }
            }
        } else {
            if(inforChannel.isPrivate) {
                isShow = false;
            } else {
                if(isOwnerOfChannel()) {
                    isShow = false;
                } else {
                    isShow = true;
                }
            }
        }
        return isShow;
    }

    return (
        <>
            <div className="member_item">
                <div className="infor">
                    <div className="name">
                        {name}
                        {isOwnerOfChannel() && <Badge pill style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 10 }}>owner</Badge>}
                    </div>
                    {
                        isShowRemoveMember() &&
                            <div className="icon" onClick={removeMember}>
                                <X color="#fff" className="remove"/>
                            </div>
                    }
                </div>
            </div>
        </>
    );
}

export default MemberItem;