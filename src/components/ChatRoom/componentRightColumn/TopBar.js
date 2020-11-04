import React from 'react';
import { Settings, Users } from 'react-feather';

const TopBar = props => {
    const { data } = props;
    const name = data?.infor?.name;
    const numberOfMember = data?.members?.length;
    return (
        <>
            <div className="topbar">
                <div className="friend_info">
                    <div className="name">
                        {name}
                    </div>
                    <div className="number_of_member">
                        <Users size={15}/>
                        {numberOfMember} members
                    </div>
                </div>
                <div className="context_menu">
                    <Settings />
                </div>
            </div>
        </>
    );
}

export default TopBar;