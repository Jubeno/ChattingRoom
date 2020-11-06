import React from 'react';
import { Settings, Users } from 'react-feather';

const TopBar = props => {
    const { data } = props;
    const isChannel = data?.type === "CHANNEL";
    const name = isChannel ? data?.infor?.name : data?.infor?.displayName;
    const numberOfMember = data?.members?.length;
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
                    <Settings />
                </div>
            </div>
        </>
    );
}

export default TopBar;