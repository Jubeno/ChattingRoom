import React, { useState } from 'react';
import { Jumbotron, Input, Button, Progress, FormGroup } from 'reactstrap';
import firebase from "firebase";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { Image } from 'react-feather'
import DelayImage from '../../Common/DelayImage/DelayImage';
import { Context as WorkSpaceContext, actions as WorkSpaceActions } from '../../../contexts/WorkSpace/WorkSpaceContext';

const CreateNameWorkSpace = props => {
    const { register } = props;
    const imageStorage = firebase.storage().ref('images');
    const [name, setName] = useState('')
    const [stateUpload, setStateUpload] = useState({ 
        isUploading: false,
        progress: 0,
        avatarURL: "" 
    })
    const handleUploadStart = () => {
        setStateUpload({ ...stateUpload, isUploading: true, progress: 0 });
    }

    const handleProgress = progress => {
        setStateUpload({ ...stateUpload, progress: progress});
    }

    const handleUploadSuccess = async filename => {
        const downloadURL = await imageStorage.child(filename).getDownloadURL();
        WorkSpaceActions.createAvatar(downloadURL);
        setStateUpload({ isUploading: false, progress: 100, avatarURL: downloadURL });
    }

    const handleUploadError = error => {
        setStateUpload({ ...stateUpload, isUploading: false });
    }

    const handleChange = event => {
        setName(event.target.value);
    }

    const submitWorkSpaceName = () => {
        WorkSpaceActions.createName(name);
    }

    return (
        <div className="container_">
            <div className="wrapper">
                <h1 className="display-3 text-center font-weight-bold text-white mb-5">STEP 1</h1>
                <div className="name">
                    <p className="text-white lead font-weight-bold">What is your workspace's name?</p>

                    <form className="form">
                        <Input 
                            type="text" 
                            name="workspaceName" 
                            id="workspace" 
                            placeholder="Name of your workspace" 
                            innerRef={register} 
                            onChange={handleChange}
                        />
                        <Button onClick={submitWorkSpaceName}>Submit</Button>
                    </form>
                </div>
                <hr className="my-5"/>
                <div className="avatar">
                    <p className="text-white lead font-weight-bold">Select a profile picture of your workspace:</p>
                    
                    <div className="sample_avatar">
                        <div className="choose_sample">
                            <div className="text">
                                <p className="text-dark text-center font-weight-bold mb-0">Choose a sample avatar</p>
                            </div>
                            <p className="text-white font-weight-bold h3">or</p>
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
                                    <Image size={50}/>
                                </CustomUploadButton>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <hr className="my-5"/> */}
                {/* <div className="preview">
                    {stateUpload.avatarURL && 
                        <div className="avatar">
                            <DelayImage className="image" src={stateUpload.avatarURL} />
                        </div>
                    }
                    <p className="lead">{nameWorkSpace}</p>
                </div> */}
            </div>
        </div>
    );
}

export default CreateNameWorkSpace;