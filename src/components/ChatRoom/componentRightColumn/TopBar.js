import React, { useEffect, useState } from 'react';
import { Settings, Users } from 'react-feather';
import { DATABASE } from '../../../utils/database';
import SettingChannel from './SettingChannel';


const TopBar = props => {
    const { data, userId, user, channelId } = props;
    const isChannel = data?.type === "CHANNEL";
    const name = isChannel ? data?.infor?.name : data?.infor?.displayName;
    const [showSetting, setShowSetting] = useState(false);
    const [member, setMember] = useState([]);

    useEffect(() => {
        setMember(data.members);
    }, [data.members])

    // update member when removed
    DATABASE
    .ref(`/userInChannel/${channelId}/members`)
    .on('child_removed', response => {
        const value = response.val();
        const oldMembers = [...member];
        const newMembers = oldMembers.filter(item => item.userId !== value.userId);
        setMember(newMembers);
    })

    // update member when removed
    DATABASE
    .ref(`/userInChannel/${channelId}/members`)
    .on('child_added', response => {
        const value = response.val();
        if(member.findIndex(item => item.userId === value.userId) !== -1) {
            return 
        } else {
            const oldMembers = [...member];
            const newMembers = [...oldMembers, value];
            setMember(newMembers);
        }
    })
    const numberOfMember = member?.length;
    return (
        <>
            <div className="topbar">
                <div className="friend_info">
                    <div className="name">
                        {name}
                    </div>
                    {
                        isChannel && 
                            <div className="number_of_member">
                                <Users size={15}/>
                                {numberOfMember} members
                            </div>
                    }
                </div>
                {isChannel && <div className="context_menu">
                    <Settings onClick={() => setShowSetting(show => !show)}/>
                </div>}
                {showSetting && 
                    <SettingChannel 
                        user={user}
                        userId={userId} 
                        data={data} 
                        member={member}
                        closeMenu={() => setShowSetting(false)}
                        isChannel={isChannel}
                        />
                    }
            </div>
        </>
    );
}

export default TopBar;