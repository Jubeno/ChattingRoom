import React, { useEffect, useState } from 'react';
import { Edit, Plus, Search } from 'react-feather';
import DelayImage from '../Common/DelayImage/DelayImage';
import CreateNewChannel from './component/CreateNewChannel';
import CreateNewUser from './component/CreateNewUser';
import EditProfileWorkspace from './component/EditProfileWorkspace';
import ListChannel from './component/ListChannel';
import ListDirectMessage from './component/ListDirectMessage';
import SearchDirectMessage from './component/SearchDirectMessage';

const LeftColumn = props => {
    const { user, workspace, userId } = props;
    const workspaceID = workspace.workspaceID
    const avatarWorkspace = workspace?.displayAvatar;
    const nameWorkspace = workspace?.displayName;
    const purposeWorkspace = workspace?.purposeOfWorkspace;
    const [ showEditProfile, setShowEditProfile ] = useState(false);
    const [ showCreateNewUser, setShowCreateNewUser ] = useState(false);
    const [ showCreateChannel, setShowCreateChannel ] = useState(false);
    const [ showSearchDirectMessage, setShowSearchDirectMessage ] = useState(false);

    const editProfile = () => setShowEditProfile(true);

    const closeEdit = () => setShowEditProfile(false);

    const createNewUser = () => setShowCreateNewUser(true);

    const closeCreate = () => setShowCreateNewUser(false);

    const createNewChannel = () => setShowCreateChannel(true);

    const closeCreateChannel = () => setShowCreateChannel(false);

    const searchDirectMessage = () => setShowSearchDirectMessage(show => !show);

    const closeDirectMessage = () => setShowSearchDirectMessage(false);

    return (
        <>
            <div className="container_left">
                <div className="infor_profile_workspace">
                    <div className="avatar">
                        <DelayImage src={avatarWorkspace}/>
                    </div>
                    <p className="name">{nameWorkspace}</p>
                    {
                        user?.isAdmin 
                        ? <div className="edit_profile" onClick={editProfile}>
                                <Edit color="#000"/>
                                { showEditProfile && <EditProfileWorkspace data={workspace} closeEdit={closeEdit}/> }
                            </div>
                        : <div></div>
                    }
                </div>
                <p className="purpose">#{purposeWorkspace}</p>
                <p className="userName">Username: {user.displayName}</p>
                <div className="list_channel">
                    <p className="title">Channel</p>
                    <div className="list">
                        <ListChannel workspaceId={workspace?.workspaceID} userId={userId}/>
                    </div>
                </div>
                <div className="direct_message">
                    <div className="top">
                        <p className="title">Direct message</p>
                        <div className="search_icon" onClick={searchDirectMessage}>
                            <Search size={20} color="#fff"/>
                        </div>
                    </div>
                    {
                        showSearchDirectMessage && 
                            <SearchDirectMessage 
                                userProfile={user}
                                userId={userId}
                                workspaceId={workspaceID}
                                closeDirectMessage={closeDirectMessage}
                            />
                    }
                    <div className="list">
                        <ListDirectMessage userId={userId}/>
                    </div>
                </div>
                <div className="create_channel" onClick={createNewChannel}>
                    <Plus color="rgb(86, 86, 87)" size={18}/>
                    <p className="text">Create channel</p>
                </div>
                {
                    user?.isAdmin &&
                        <div className="create_new_user" onClick={createNewUser}>
                            <Plus color="rgb(86, 86, 87)" size={18}/>
                            <p className="text">Create new user</p>
                        </div>
                }
            </div>
            { showCreateChannel && <CreateNewChannel userProfile={user} workspaceId={workspace?.workspaceID} userId={userId} workspaceName={workspace?.workspace} closeCreateChannel={closeCreateChannel}/> }
            { showCreateNewUser && <CreateNewUser workspaceName={workspace?.workspace} closeCreate={closeCreate}/> }
        </>
    );
}

export default LeftColumn;