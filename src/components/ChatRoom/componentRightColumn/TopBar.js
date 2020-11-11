import React, { useState } from 'react';
import { Settings, Users } from 'react-feather';
import SettingChannel from './SettingChannel';


const TopBar = props => {
    const { data, userId, user } = props;
    const isChannel = data?.type === "CHANNEL";
    const name = isChannel ? data?.infor?.name : data?.infor?.displayName;
    const numberOfMember = data?.members?.length;
    const [showSetting, setShowSetting] = useState(false);

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
                <div className="context_menu">
                    <Settings onClick={() => setShowSetting(show => !show)}/>
                </div>
                {showSetting && 
                    <SettingChannel 
                        user={user}
                        userId={userId} 
                        data={data} 
                        closeMenu={() => setShowSetting(false)}
                        />
                    }
            </div>
        </>
    );
}

export default TopBar;