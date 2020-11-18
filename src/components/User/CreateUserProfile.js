import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import './User.scss';
import firebase from 'firebase';
import { getKeyByProperty } from '../../utils/function';
import DelayImage from '../Common/DelayImage/DelayImage';
import { Plus, RotateCcw } from 'react-feather';
import { Context as UserProfileContext, actions as UserProfileActions } from '../../contexts/UserProfile/UserProfileContext';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';
import MissingProfile from '../ChatRoom/componentUserProfile/MissingProfile';
import UpdateProfileDone from '../ChatRoom/componentUserProfile/UpdateProflieDone';
import { DATABASE } from '../../utils/database';


const CreateUserProfile = props => {
    const userId = props.match.params.id;
    const AutoplaySlider = withAutoplay(AwesomeSlider);
    const history = useHistory();
    const { workspace, nickname } = history.location.state;
    const { register, handleSubmit } = useForm();
    const { avatar } = useContext(UserProfileContext).state;
    const [ missingProfile, setMissingProfile ] = useState({isMissing: false, name: ''});
    const [ uploadDone, setUploadDone ] = useState(false);
    const imageStorage = firebase.storage().ref('users/avatar');
    const usersOnDB = firebase.database().ref('user/list/');
    const [stateUpload, setStateUpload] = useState({ 
        isUploading: false,
        progress: 0,
        avatarURL: "",
        isUploaded: false
    })

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
        if(!avatar) {
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
            const key = getKeyByProperty(response.val(), 'nickname', nickname);
            const userProfile = usersOnDB.child(key);
            userProfile.update({ 
                "displayName": data.username,
                "gender": data.gender,
                "phoneNumber": data.phoneNumber,
                "birthday": data.birthday,
                "displayAvatar": avatar,
                "isMissingProfile": false
            }
            , () => history.push(`/chatroom/${userId}`, {workspace})
            );
            })
        }
    }

    const reuploadAvatar = () => {
        UserProfileActions.resetAvatar();
    }

    const handleUploadStart = () => {
        setStateUpload({ ...stateUpload, isUploading: true, progress: 0 });
    }

    const handleProgress = progress => {
        setStateUpload({ ...stateUpload, isUploading: true, progress: progress});
    }

    const handleUploadSuccess = async filename => {
        const downloadURL = await imageStorage.child(filename).getDownloadURL();
        await UserProfileActions.createAvatar(downloadURL);
        setStateUpload({ isUploading: false, progress: 100, avatarURL: downloadURL, isUploaded: true });
    }

    const handleUploadError = error => {
        setStateUpload({ ...stateUpload, isUploading: false });
    }

    const paramsSlider = {
        play: true,
        cancelOnInteraction: true,
        interval: 3000,

    }

    return (
        <>
            <div className="create_user_profile" id="create_user_profile">
                <div className="main">
                    <h1 className="text-left text-uppercase display-5 title">Create profile</h1>

                    <form className="form" onSubmit={handleSubmit(createProfileUser)}>
                        <div className="preview_avatar">
                            {
                                avatar 
                                ? <div className="avatar">
                                    <DelayImage className="image" src={avatar}/>
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
                                                onUploadStart={handleUploadStart}
                                                onUploadError={handleUploadError}
                                                onUploadSuccess={handleUploadSuccess}
                                                onProgress={handleProgress}
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
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="gender">Gender</Label>
                            <Input 
                                type="select" 
                                name="gender" 
                                id="gender"
                                innerRef={register}
                                className="input"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </Input>
                        </FormGroup>
                        
                        <FormGroup>
                            <Label for="phoneNumber">Phone Number</Label>
                            <Input 
                                type="text" 
                                name="phoneNumber" 
                                id="phoneNumber" 
                                innerRef={register}
                                className="input"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="birthday">Birthday <Badge className="font-italic" color="dark" pill>Optional</Badge></Label>
                            <Input 
                                type="text" 
                                name="birthday" 
                                id="birthday" 
                                placeholder="" 
                                innerRef={register}
                                className="input"
                                placeholder="31/01/2000"
                            />
                        </FormGroup>
                        <div className="btn_submit">
                            <Button type="submit" color="success">Submit</Button>
                        </div>
                    </form>
                </div>
                
                <div className="slider">
                    <AutoplaySlider {...paramsSlider}>
                        <div data-src="/img/1.jpg" />
                        <div data-src="/img/2.jpg" />
                        <div data-src="/img/3.jpg" />
                        <div data-src="/img/4.jpg" />
                        <div data-src="/img/5.jpg" />
                        <div data-src="/img/6.jpg" />
                    </AutoplaySlider>
                </div>
                {
                    missingProfile.isMissing &&
                        <MissingProfile
                            close={() => setMissingProfile({...missingProfile, isMissing: false})}
                            subject={missingProfile.name}
                        />
                }
                {
                    uploadDone &&
                        <UpdateProfileDone
                            close={() => setUploadDone(false)}
                        />
                }
            </div>
            
        </>
    );
}

export default CreateUserProfile;