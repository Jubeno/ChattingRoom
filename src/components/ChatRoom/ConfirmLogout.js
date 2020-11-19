import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { DATABASE } from '../../utils/database';
import { getKeyByProperty } from '../../utils/function';
import Loading from '../Common/Loading/Loading';

const ConfirmDeleteChannel = props => {
    const history = useHistory();
    const { close, userId } = props;
    const [ loading, setLoading ] = useState(false);

    const deleteToken = async userId => {
        await DATABASE
        .ref('/user/list')
        .once('value', response => {
            if(response.val()) {
                const key = getKeyByProperty(response.val(), 'userID', userId);
                DATABASE.ref('/user/list').child(key).update({ token: '' })
            }
        })
        setTimeout(() => {
            setLoading(false);
            history.push('/workspace');
        }, 500);
    }

    const acceptLogout = async () => {
        setLoading(true);
        localStorage.clear();
        await deleteToken(userId);
    }

    const cancelLogout = () => {
        close();
    }

    return (
        <>
            { loading && <Loading /> }
            <Popup
                open={true}
                closeOnDocumentClick={false}
                closeOnEscape={false}
                className="confirm_logout_popup"
            >
                <div className="top">
                    <div className="title">Do you really want to exit ?</div>
                </div>
                <div className="bottom">
                    <button className="button accept" onClick={acceptLogout}>OK</button>
                    <button className="button cancel" onClick={cancelLogout}>Cancel</button>
                </div>
            </Popup>
        </>
    );
}

export default ConfirmDeleteChannel;