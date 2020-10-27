import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import { Badge, Form, FormGroup, Input, Label } from 'reactstrap';
import DelayImage from '../../Common/DelayImage/DelayImage';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import firebase from 'firebase';

const EditProfileWorkspace = props => {
    const { data, cancelEditProfile } = props;
    const avatar = data?.displayAvatar;
    const imageStorage = firebase.storage().ref('workspaces/avatar');
    const { register, handleSubmit } = useForm();
    const [ displayAvatar, setDisplayAvatar ] = useState(avatar);
    const [stateUpload, setStateUpload] = useState({ 
        isUploading: false,
        progress: 0,
        avatarURL: "",
        isUploaded: false
    })

    useEffect(() => {
        setDisplayAvatar(avatar)
    }, [avatar])

    const handleUploadStart = () => {
        setStateUpload({ ...stateUpload, isUploading: true, progress: 0 });
    }

    const handleProgress = progress => {
        setStateUpload({ ...stateUpload, isUploading: true, progress: progress});
    }

    const handleUploadSuccess = async filename => {
        const downloadURL = await imageStorage.child(filename).getDownloadURL();
        // await UserProfileActions.createAvatar(downloadURL);
        setDisplayAvatar(downloadURL)
        setStateUpload({ isUploading: false, progress: 100, avatarURL: downloadURL, isUploaded: true });
    }

    const handleUploadError = error => {
        setStateUpload({ ...stateUpload, isUploading: false });
    }

    const reuploadAvatar = () => {
        setDisplayAvatar(null)
    }

    const acceptChangeProfile = () => {

    }
    const cancel = () => {
        cancelEditProfile()
    };

    return (
        <Form className="edit_profile_workspace" onSubmit={handleSubmit(acceptChangeProfile)}>
            <h4>Workspace profile</h4>
            <div className="displayAvatar">
                <label>Display avatar:</label>
                <div className="wrapper_avatar">
                    {
                        displayAvatar 
                        ? <div className="avatar">
                            <DelayImage className="image" src={displayAvatar}/>
                            <div className="reupload">
                                <RotateCcw size="30" color="#fff" onClick={reuploadAvatar}/>
                            </div>
                        </div>
                        :   <div className="no_avatar">
                                <Badge pill color="danger" className="title_upload">Choose a new avatar</Badge>
                                <div className="box">
                                    <CustomUploadButton
                                        accept="image/*"
                                        storageRef={imageStorage}
                                        onUploadStart={handleUploadStart}
                                        onUploadError={handleUploadError}
                                        onUploadSuccess={handleUploadSuccess}
                                        onProgress={handleProgress}
                                        style={{ cursor: 'pointer', backgroundColor: 'transparent', color: '#fff', borderRadius: 4}}
                                    >
                                        <Plus size={50}/>
                                    </CustomUploadButton>
                                </div>
                            </div>   
                        
                    }
                </div>
            </div>
            <div className="displayName">
                <label>Display name:</label>
                <Input 
                    type="text"
                    name="displayName"
                    defaultValue={data?.displayName}
                    innerRef={register}
                />
            </div>
            <div className="purposeOfWorkspace">
                <label>Purpose:</label>
                <Input 
                    type="text"
                    name="purposeOfWorkspace"
                    defaultValue={data?.purposeOfWorkspace}
                    innerRef={register}
                />
            </div>
            <div className="button_submit_change_profile">
                <button className="cancel" onClick={cancel}>Cancel</button>
                <button className="accept" type="submit">Apply</button>
            </div>
            
        </Form>
    );
}

export default EditProfileWorkspace;