import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Plus, RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import { Badge, Form, FormGroup, Input, Label } from 'reactstrap';
import DelayImage from '../../Common/DelayImage/DelayImage';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import firebase from 'firebase';
import Popup from 'reactjs-popup';
import './EditProfileWorkspace.scss';
import Loading from '../../Common/Loading/Loading';
import { getKeyByProperty } from '../../../utils/function';

const EditProfileWorkspace = forwardRef((props, ref) => {
    const { data, closeEdit } = props;
    const workspaceID = data?.workspaceID;
    const avatar = data?.displayAvatar;
    const imageStorage = firebase.storage().ref('workspaces/avatar');
    const workspaceOnDB = firebase.database().ref('workspace/list');
    const { register, handleSubmit } = useForm();
    const [ displayAvatar, setDisplayAvatar ] = useState(avatar);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDisplayAvatar(avatar)
    }, [avatar])

    const handleUploadSuccess = async filename => {
        const downloadURL = await imageStorage.child(filename).getDownloadURL();
        setDisplayAvatar(downloadURL)
    }

    const reuploadAvatar = () => {
        setDisplayAvatar(null)
    }

    const acceptChangeProfile = async data => {
        setLoading(true);
        await workspaceOnDB.once('value', response => {
            const key = getKeyByProperty(response.val(), 'workspaceID', workspaceID);
            const workspaceProfile = workspaceOnDB.child(key);
            workspaceProfile.update({
                "displayName": data.displayName,
                "displayAvatar": displayAvatar,
                "purposeOfWorkspace": data.purposeOfWorkspace
            }, () => {
                    setLoading(false);
                    closeEdit();
                }
            );
        })
    }

    const cancel = () => {
        closeEdit()
    };

    return (
        <>
            { loading && <Loading /> }
            <Popup
                open={true}
                className="edit_profile_workspace_popup"
                closeOnDocumentClick={false}
                closeOnEscape={false}
            >
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
                                                // onUploadStart={handleUploadStart}
                                                // onUploadError={handleUploadError}
                                                onUploadSuccess={handleUploadSuccess}
                                                // onProgress={handleProgress}
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
            </Popup>
        </>
    );
});

export default EditProfileWorkspace;