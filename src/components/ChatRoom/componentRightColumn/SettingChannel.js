import React, { useState } from 'react';
import ConfirmDeleteChannel from './SettingChannelComponent/ConfirmDeleteChannel';
import ConfirmLeaveChannel from './SettingChannelComponent/ConfirmLeaveChannel';
import EditChannel from './SettingChannelComponent/EditChannel';
import EditMember from './SettingChannelComponent/EditMember';
import './SettingChannelComponent/SettingChannel.scss'

const SettingChannel = props => {
    const { data, userId, closeMenu, user, member, isChannel } = props;
    const inforChannel = data.infor;
    const [showEditChannel, setShowEditChannel] = useState(false);
    const [showEditMember, setShowEditMember] = useState(false);
    const [showConfirmDeleteChannel, setShowConfirmDeleteChannel] = useState(false);
    const [showConfirmLeavehannel, setShowConfirmLeaveChannel] = useState(false);

    const isOwnerOfChannel = () => inforChannel.createBy === userId;

    const editChannel = () => {
        setShowEditChannel(show => !show);
    }

    const editMember = () => {
        setShowEditMember(show => !show);
    }

    const deleteChannel = async () => {
        setShowConfirmDeleteChannel(show => !show);
    }

    const leaveChannel = async () => {
        setShowConfirmLeaveChannel(show => !show);
    }

    const LIST_CONTEXT_ADMIN = [
        {id: 0, class: 'edit_channel', name: 'Edit your channel', func: editChannel},
        {id: 1, class: 'edit_member', name: 'Members', func: editMember},
        {id: 2, class: 'delete_channel', name: 'Delete your channel', func: deleteChannel},
    ]
    const LIST_CONTEXT_MEMBER = [
        {id: 0, class: 'edit_channel', name: 'Edit your channel', func: editChannel},
        {id: 1, class: 'edit_member', name: 'Members', func: editMember},
        {id: 2, class: 'out_channel', name: 'Leave this channel', func: leaveChannel},
    ]

    const list = isOwnerOfChannel() ? LIST_CONTEXT_ADMIN : LIST_CONTEXT_MEMBER;
    return (
        <>
            <div id="setting_channel" className="setting_channel">
                {
                    list.map((item, key) =>
                        <div key={key} className={`setting_item ${item.class}`} onClick={item.func}>
                            <div>{item.name}</div>
                        </div>
                    )
                }
                {showEditChannel && 
                    <EditChannel
                        userId={userId}
                        inforChannel={inforChannel}
                        close={() => setShowEditChannel(false)}
                        closeMenu={closeMenu}
                        user={user}
                    />
                }
                {showEditMember &&
                    <EditMember 
                        userId={userId}
                        inforChannel={inforChannel}
                        close={() => setShowEditMember(false)}
                        closeMenu={closeMenu}
                        user={user}
                        member={member}
                        isChannel={isChannel}
                    />
                }
                {showConfirmDeleteChannel &&
                    <ConfirmDeleteChannel 
                        inforChannel={inforChannel}
                        close={() => setShowConfirmDeleteChannel(false)}
                    />
                }
                {showConfirmLeavehannel &&
                    <ConfirmLeaveChannel 
                        user={user}
                        close={() => setShowConfirmLeaveChannel(false)}
                        userId={userId}
                        inforChannel={inforChannel}
                    />
                }
            </div>
        </>
    );
}

export default SettingChannel;