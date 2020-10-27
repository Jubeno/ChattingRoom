import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ChatRoom.scss';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import firebase from "firebase";
import Loading from '../Common/Loading/Loading';

const ChatRoom = props => {
    const userId = props.match.params.id;
    const history = useHistory();
    const { workspace } = history.location.state;
    const userOnDB = firebase.database().ref('/user/list');
    const workspaceOnDB = firebase.database().ref('/workspace/list');
    const [ dataFromDB, setDataFromDB ] = useState({ user: null, workspace: null });
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        setLoading(true);
        async function getDataFromDB() {
            let dataUser = {};
            let dataWorkspace = {};
            await userOnDB.orderByChild('userID').equalTo(userId)
            .once('value', response => {
                dataUser = Object.values(response.val());
            })
    
            await workspaceOnDB.orderByChild('workspace').equalTo(workspace)
            .once('value', response => {
                dataWorkspace = Object.values(response.val());
            })
            setDataFromDB({ ...dataFromDB, user: dataUser[0], workspace: dataWorkspace[0] });
            setLoading(false);
        }
        getDataFromDB();
    }, [])

    return (
        <>
            { loading && <Loading /> }
            <div className="chatroom" id="chatroom">
                <div className="wrapper">
                    <div className="left">
                        <LeftColumn user={dataFromDB.user} workspace={dataFromDB.workspace} />
                    </div>
                    <div className="right">
                        <RightColumn user={dataFromDB.user} workspace={dataFromDB.workspace} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatRoom;