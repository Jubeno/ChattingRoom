import React, { useState } from 'react';
import { Edit, Plus } from 'react-feather';
import DelayImage from '../Common/DelayImage/DelayImage';
import EditProfileWorkspace from './component/EditProfileWorkspace';

const LeftColumn = props => {
    const { user, workspace } = props;
    const avatarWorkspace = workspace?.displayAvatar;
    const nameWorkspace = workspace?.displayName;
    const purposeWorkspace = workspace?.purposeOfWorkspace;
    const [ showEditProfile, setShowEditProfile ] = useState(false);
    console.log('showEditProfile: ', showEditProfile);

    const editProfile = () => setShowEditProfile(true);

    const cancelEditProfile = () => setShowEditProfile(show => !show); // khong chay

    return (
        <div className="container_left">
            <div className="infor_profile_workspace">
                <div className="avatar">
                    <DelayImage src={avatarWorkspace}/>
                </div>
                <p className="name">{nameWorkspace}</p>
                <div className="edit_profile" onClick={editProfile}>
                    <Edit color="#000"/>
                    { showEditProfile && <EditProfileWorkspace data={workspace} cancelEditProfile={cancelEditProfile}/> }
                </div>
            </div>
            <p className="purpose">#{purposeWorkspace}</p>
            <div className="list_channel">
                <p className="title">Channel</p>
                <div className="list">
                    LIST
                </div>
            </div>
            <div className="create_channel">
                <Plus color="#fff" size={18}/>
                <p className="text">Create channel</p>
            </div>
        </div>
    );
}

export default LeftColumn;