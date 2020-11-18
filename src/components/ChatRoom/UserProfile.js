import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import firebase from 'firebase';
import { getKeyByProperty } from '../../utils/function';
import DelayImage from '../Common/DelayImage/DelayImage';
import { Plus, RotateCcw } from 'react-feather';
import { Context as UserProfileContext, actions as UserProfileActions } from '../../contexts/UserProfile/UserProfileContext';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import MissingProfile from './componentUserProfile/MissingProfile';
import UpdateProfileDone from './componentUserProfile/UpdateProflieDone';
import { DATABASE } from '../../utils/database';

const UserProfile = props => {
    const { userId, user, close } = props;
    const { register, handleSubmit } = useForm();
    // const { avatar } = useContext(UserProfileContext).state;
    const [ userAvatar, setUserAvatar ] = useState(null);
    const [ missingProfile, setMissingProfile ] = useState({isMissing: false, name: ''});
    const [ updateProfileDone, setUpdateProfileDone ] = useState(false);
    const imageStorage = firebase.storage().ref('users/avatar');
    const usersOnDB = firebase.database().ref('user/list/');
    const name = user.displayName;
    const birthday = user.birthday;
    const gender = user.gender;
    const phoneNumber = user.phoneNumber;

    useEffect(() => {
        setUserAvatar(user.displayAvatar);
    }, [user.displayAvatar]);

    const handleUploadSuccess = async filename => {
        const downloadURL = await imageStorage.child(filename).getDownloadURL();
        setUserAvatar(downloadURL);
    }
    const isExistOnDatabase = async phoneNumber => {
        let isExist = false;
        await DATABASE
        .ref('/user/list')
        .orderByChild('phoneNumber')
        .equalTo(phoneNumber)
        .once('value', response => {
            if(response.exists()) {
                isExist = true;
            }
        })
        return isExist;
    }
    
    const isValidPhoneNumber = async phoneNumber => {
        let isValid = true;
        const regexPhoneNumber = /^\d{10}$/
        const comparePhone = phoneNumber.match(regexPhoneNumber); 
        const isExist = await isExistOnDatabase(phoneNumber);

        if(!comparePhone) {
            isValid = false;
            setMissingProfile({isMissing: true, name: 'phone number'});
        } else if(isExist) {
            isValid = false;
            setMissingProfile({isMissing: true, name: 'phone number exist on database'});
        } else {
            isValid = true;
        }
        return isValid;
    }

    const isValidAvatar = () => {
        let isValid = true;
        if(!userAvatar) {
            isValid = false;
            setMissingProfile({ isMissing: true, name: 'avatar' })
        }
        return isValid;
    };

    const createProfileUser = async data => {
        const validAvatar = isValidAvatar();
        if(!validAvatar) { return }
        const validPhone = await isValidPhoneNumber(data.phoneNumber);
        if(!validPhone) { return }
        
        if(validAvatar && validPhone) {
            await usersOnDB.once('value', response => {
                const key = getKeyByProperty(response.val(), 'nickname', user.nickname);
                const userProfile = usersOnDB.child(key);
                userProfile.update({ 
                    "displayName": data.username,
                    "gender": data.gender,
                    "phoneNumber": data.phoneNumber,
                    "birthday": data.birthday,
                    "displayAvatar": userAvatar,
                    "isMissingProfile": false
                });
            })
            setUpdateProfileDone(true);
            // close();
        }
    }

    const reuploadAvatar = () => {
        setUserAvatar('');
    }

    return (
        <>
            <div className="user_profile main">
                    <h1 className="text-left text-uppercase display-5 title">Edit your profile</h1>

                    <form className="form" onSubmit={handleSubmit(createProfileUser)}>
                        <div className="preview_avatar">
                            {
                                userAvatar 
                                ? <div className="avatar">
                                    <DelayImage className="image" src={userAvatar}/>
                                    <div className="reupload">
                                        <RotateCcw size="30" onClick={reuploadAvatar}/>
                                    </div>
                                </div>
                                :   <div className="no_avatar">
                                        <Badge pill color="danger" className="title_upload">Upload avatar</Badge>
                                        <div className="box">
                                            <CustomUploadButton
                                                accept="image/*"
                                                storageRef={imageStorage}
                                                onUploadSuccess={handleUploadSuccess}
                                                style={{ cursor: 'pointer', backgroundColor: 'transparent', color: '#343a40', borderRadius: 4}}
                                            >
                                                <Plus size={106}/>
                                            </CustomUploadButton>
                                        </div>
                                    </div>   
                                
                            }
                        </div>
                        <FormGroup>
                            <Label for="username">Display name</Label>
                            <Input 
                                type="text" 
                                name="username" 
                                id="username" 
                                autoFocus
                                required
                                className="input"
                                innerRef={register}
                                defaultValue={name}
                            />
                        </FormGroup>
                        <div className="group">
                            <FormGroup>
                                <Label for="gender">Gender</Label>
                                <Input 
                                    type="select" 
                                    name="gender" 
                                    id="gender"
                                    innerRef={register}
                                    className="input"
                                    defaultValue={gender}
                                >
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </Input>
                            </FormGroup>
                            <FormGroup className="birthday">
                                <Label for="birthday">Birthday <Badge className="font-italic" color="dark" pill>Optional</Badge></Label>
                                <Input 
                                    type="text" 
                                    name="birthday" 
                                    id="birthday" 
                                    placeholder="" 
                                    innerRef={register}
                                    className="input"
                                    defaultValue={birthday}
                                />
                            </FormGroup>
                            <FormGroup className="phone_number">
                                <Label for="phoneNumber">Phone Number <Badge className="font-italic" color="dark" pill>Optional</Badge></Label>
                                <Input 
                                    type="text" 
                                    name="phoneNumber" 
                                    id="phoneNumber" 
                                    innerRef={register}
                                    className="input"
                                    defaultValue={phoneNumber}
                                />
                            </FormGroup>
                        </div>
                        
                        <div className="btn_submit">
                            <Button type="submit" color="success">Apply</Button>
                        </div>
                    </form>
                    { missingProfile.isMissing && 
                    <MissingProfile
                        subject={missingProfile.name} 
                        close={() => setMissingProfile({...missingProfile, isMissing: false})}
                    />
                    }
                    { updateProfileDone && 
                        <UpdateProfileDone
                            close={() => setUpdateProfileDone(false)}
                            closeUpdate={close}
                        />
                    }
            </div>
            
        </>
    );
}

export default UserProfile;