import React, { useContext, useEffect, useState } from 'react';
import { Jumbotron, Input, Button, Progress, FormGroup } from 'reactstrap';
import firebase from "firebase";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { ArrowRight, ChevronRight, Image, RotateCcw } from 'react-feather'
import DelayImage from '../../Common/DelayImage/DelayImage';
import { Context as WorkSpaceContext, actions as WorkSpaceActions } from '../../../contexts/WorkSpace/WorkSpaceContext';
import { useForm } from "react-hook-form";
import { getKeyByProperty } from '../../../utils/function';

const CreateNameWorkSpace = props => {
    const { activeName, history } = props;
    const { register, handleSubmit } = useForm();
    const imageStorage = firebase.storage().ref('workspaces/avatar');
    const { avatar, name } = useContext(WorkSpaceContext).state;
    const workspaceOnDB = firebase.database().ref('/workspace/list');
    const [stateUpload, setStateUpload] = useState({ 
        isUploading: false,
        progress: 0,
        avatarURL: "",
        isUploaded: false
    })

    // active next step
    useEffect(() =>{ (avatar && name) && WorkSpaceActions.goToNextStep() }, [avatar, name]);

    const handleUploadStart = () => {
        setStateUpload({ ...stateUpload, isUploading: true, progress: 0 });
    }

    const handleProgress = progress => {
        setStateUpload({ ...stateUpload, isUploading: true, progress: progress});
    }

    const handleUploadSuccess = async filename => {
        const downloadURL = await imageStorage.child(filename).getDownloadURL();
        await WorkSpaceActions.createAvatar(downloadURL);
        setStateUpload({ isUploading: false, progress: 100, avatarURL: downloadURL, isUploaded: true });

        // update data on db
        workspaceOnDB.once('value', response => {
            const key = getKeyByProperty(response.val(), 'workspace', history.workspace)
            const setDisplayNameOnDB = workspaceOnDB.child(key);
            setDisplayNameOnDB.update({ "displayAvatar": downloadURL }) // update expired time 
        })
    }

    const handleUploadError = error => {
        setStateUpload({ ...stateUpload, isUploading: false });
    }

    const submitWorkSpaceName = async data => {
        if (data.workspaceName !== '') {
            await WorkSpaceActions.createName(data.workspaceName);

            // update data on db
            workspaceOnDB.once('value', response => {
                const key = getKeyByProperty(response.val(), 'workspace', history.workspace)
                const setDisplayNameOnDB = workspaceOnDB.child(key);
                setDisplayNameOnDB.update({ "displayName": data.workspaceName }) // update expired time 
            })
        }
    }

    const goToNextStep = () => WorkSpaceActions.goToNextStep();

    const reuploadAvatar = () => {
        WorkSpaceActions.resetAvatar();
    }

    const isShowButtonNextStep = avatar && name && activeName;

    return (
        <div className="container_" >
            {isShowButtonNextStep && <div className="btn_next" onClick={goToNextStep}><ChevronRight size="30"/></div>}
            <div className="wrapper">
                <h1 className="display-3 text-center font-weight-bold text-white mb-5">STEP 1</h1>
                <div className="avatar mb-3">
                    <p className="text-white lead font-weight-bold">Select a profile picture of your workspace:</p>
                    
                    <div className="sample_avatar">
                        {
                            !avatar ? 
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
                            : 
                            <div className="preview_avatar">
                                <div className="avatar">
                                    <DelayImage className="image" src={avatar}/>
                                </div>
                                <div className="reupload">
                                    <RotateCcw size="30" onClick={reuploadAvatar}/>
                                </div>
                            </div>

                        }
                    </div>
                </div>
                {stateUpload.isUploading && <Progress value={stateUpload.progress} />}
                <hr className="my-5"/>

                <div className="name">
                    <p className="text-white lead font-weight-bold">What is your workspace's name?</p>

                    <form className="form" onSubmit={handleSubmit(submitWorkSpaceName)}>
                        <Input 
                            type="text" 
                            name="workspaceName" 
                            id="workspace" 
                            placeholder="Name of your workspace" 
                            innerRef={register} 
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </div>
                

                
            </div>
        </div>
    );
}

export default CreateNameWorkSpace;