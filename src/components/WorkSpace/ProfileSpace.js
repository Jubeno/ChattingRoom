import React from 'react';
import { useStateValue } from '../../StateProvider';

const ProfileSpace = () => {
    const [ { workspaceState }, dispatch ] = useStateValue();
    console.log('workspaceState: ', workspaceState);
    return (
        <div className="profile_workspace">
            Profile
        </div>
    );
}

export default ProfileSpace;