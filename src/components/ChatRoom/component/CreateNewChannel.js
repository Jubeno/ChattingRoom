import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { useForm } from 'react-hook-form';
import Popup from 'reactjs-popup';
import { Form, Input } from 'reactstrap';
import './CreateNewChannel.scss';
import SearchMember from './SearchMember';
import firebase from 'firebase';

const CreateNewChannel = props => {
    const { closeCreateChannel, userId } = props;
    const { register, handleSubmit } = useForm();
    const [ members, setMembers ] = useState([]);
    const [ showSearchMember, setShowSearchMember ] = useState(false);
    const [ resultSearch, setResultSearch ] = useState([]);
    const [ listUser, setListUser ] = useState([]);
    const [ paramSearch, setParamSearch ] = useState('');
    const userOnDB = firebase.database().ref('/user/list');

    const createNewChannel = async data => {
        console.log('%c data: ', 'color: red' , data);
    }

    useEffect(() => {
        userOnDB.once('value', response => {
            const valueOnDB = Object.values(response.val());
            setListUser(valueOnDB)
        })
    }, [])

    const cancel = () => closeCreateChannel();

    const searchMember = value => {
        setShowSearchMember(true);
        if(value !== "") {
            setParamSearch(value);
            const result = listUser.filter(item => (item.displayName.includes(paramSearch.toLowerCase()) && item.userID !== userId));
            setResultSearch(result);
        } else {
            setResultSearch(listUser);
        }
    };

    return (
        <Popup
            open={true}
            closeOnDocumentClick={false}
            closeOnEscape={false}
            className="create_new_channel_popup"
        >
            <Form onSubmit={handleSubmit(createNewChannel)} className="form_create_new_channel">
                <h4>Create new channel</h4>
                <hr/>
                <div className="channel_name">
                    <label>Channel name:</label>
                    <Input 
                        type="text"
                        name="channelName"
                        // autoFocus={true}
                        placeholder={'Benoo\'s channel'}
                        innerRef={register}
                    />
                </div>
                <div className="member_of_channel">
                    <label>Members:</label>
                    <Input 
                        type="text"
                        name="members"
                        innerRef={register}
                        placeholder={'Benoo'}
                        onChange={event => searchMember(event.target.value)}
                        autocomplete="off"
                        autoFocus={true}
                    />
                    { (resultSearch.length > 0 && showSearchMember) && <SearchMember resultSearch={resultSearch}/> }
                </div>
                <div className="button_create_new_channel">
                    <button className="cancel" onClick={cancel}>Cancel</button>
                    <button className="accept" type="submit">Create</button>
                </div>
            </Form>
        </Popup>
    );
}

export default CreateNewChannel;