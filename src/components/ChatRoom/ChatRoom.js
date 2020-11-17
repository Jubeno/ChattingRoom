import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ChatRoom.scss';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import firebase from "firebase";
import Loading from '../Common/Loading/Loading';
import { Context as DirectMessageContext, actions as DirectMessageActions } from '../../contexts/DirectMessage/DirectMessageContext';
import { userOnDB, workspaceOnDB } from '../../utils/database';
import UserProfile from './UserProfile';
import { User } from 'react-feather';

const ChatRoom = props => {
    const userId = props.match.params.id;
    const history = useHistory();
    const { workspace } = history.location.state;
    const [ dataFromDB, setDataFromDB ] = useState({ user: null, workspace: null });
    const [ loading, setLoading ] = useState(false);
    const [ showEditUserProfile, setShowEditUserProfile ] = useState(false);

    // get data user
    useEffect(() => {
        setLoading(true);
        async function getDataFromDB() {
            let dataUser = {};
            let dataWorkspace = {};
            await userOnDB.orderByChild('userID').equalTo(userId)
            .once('value', response => {
                if(!response.val()) {
                    history.push('/workspace')
                } else {
                    dataUser = Object.values(response.val());
                }
            })

            await workspaceOnDB.orderByChild('workspace').equalTo(workspace)
            .once('value', response => {
                dataWorkspace = Object.values(response.val());
            })
            setDataFromDB({ ...dataFromDB, user: dataUser[0], workspace: dataWorkspace[0] });
            setLoading(false);
        }
        getDataFromDB();
    }, []);

    // get list user
    useEffect(() => {
        async function getDataFromDB() {
            let dataUser = {};
            let dataWorkspace = {};
            await userOnDB.orderByChild('workspace').equalTo(workspace)
            .once('value', response => {
                dataUser = Object.values(response.val());
            })

            await workspaceOnDB.orderByChild('workspace').equalTo(workspace)
            .once('value', response => {
                dataWorkspace = Object.values(response.val());
            })
            DirectMessageActions.setDataWorkspace({ user: dataUser, workspace: dataWorkspace })
        }
        getDataFromDB();
        
    }, [])

    // update workspace profile when edit is completed
    if(dataFromDB.workspace) {
        workspaceOnDB.orderByChild('workspaceID').equalTo(dataFromDB?.workspace?.workspaceID).on('child_changed', response => {
            setDataFromDB({ ...dataFromDB, workspace: response.val()});
        })
    }

    // update user profile when edit is completed
    userOnDB.orderByChild('userID').equalTo(userId).on('child_changed', response => {
        setDataFromDB({ ...dataFromDB, user: response.val()});
    })

    return (
        <>
            { loading && <Loading /> }
            {
                dataFromDB.user !== null && 
                    <div className="chatroom" id="chatroom">
                        <div className="wrapper">
                            <div className="left">
                                <LeftColumn userId={userId} user={dataFromDB?.user} workspace={dataFromDB?.workspace} />
                            </div>
                            <div className="right">
                                <RightColumn userId={userId} user={dataFromDB?.user} workspace={dataFromDB?.workspace} />
                            </div>
                            <div className="button_user_profile" onClick={() => setShowEditUserProfile(show => !show)}>
                                <User size={30}/>
                            </div>
                            {showEditUserProfile &&
                                <UserProfile 
                                    userId={userId} 
                                    user={dataFromDB?.user} 
                                    workspace={dataFromDB?.workspace}
                                    close={() => setShowEditUserProfile(false)}
                                />
                            }
                        </div>
                    </div>
            }
        </>
    );
}

export default ChatRoom;