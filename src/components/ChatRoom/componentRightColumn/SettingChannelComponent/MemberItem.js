import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import { DATABASE } from '../../../../utils/database';

const MemberItem = props => {
    const { data, channelId } = props;
    
    const [userProfile, setUserProfile] = useState({});
    const avatar = userProfile?.displayAvatar || '/img/avatar-placeholder.png';
    const name = userProfile?.displayName;

    useEffect(() => {
        async function getUserProfile() {
            await DATABASE
            .ref('/user/list')
            .orderByChild('userID')
            .equalTo(data)
            .once('value', response => {
                const value = response.val();
                if(value) {
                    setUserProfile(Object.values(value)[0]);
                }
            })
        }
        getUserProfile();
    }, [])

    const getKeyToRemove = (array, value) => {
        for (let key = 0; key < array.length; key++) {
            if (array[key] === value) {
                return key;
            }
        }
    }

    const removeMember = async () => {
        console.log('%c data: ', 'color: red' , data);
        await DATABASE
        .ref(`/userInChannel/${channelId}/members`)
        .once('value', response => {
            const value = response.val();
            if(value) {
                const key = getKeyToRemove(value, data);
                DATABASE.ref(`/userInChannel/${channelId}/members/${key}`).remove();
            }
        })
    }

    return (
        <>
            <div className="member_item">
                <div className="avatar">
                    <img src={avatar} alt="avatar"/>
                </div>
                <div className="infor">
                    <div className="name">
                        {name}
                    </div>
                    <div className="icon" onClick={removeMember}>
                        <X color="#fff" className="remove"/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MemberItem;