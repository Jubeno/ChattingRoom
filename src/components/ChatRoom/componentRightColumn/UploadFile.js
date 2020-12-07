import React, { useState } from 'react';
import { Check, File, Image, X } from 'react-feather';
import { Progress } from 'reactstrap';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import firebase from 'firebase';
import { DATABASE, messageOnDB } from '../../../utils/database';
import { generateId, getCurrentTimeStamp } from '../../../utils/function';
import { MESSAGE_TYPE } from '../../../utils/constant';
import DelayImage from '../../Common/DelayImage/DelayImage';

const UploadFile = props => {
    const { channelId, open, conversationId, userId, displayName, avatar, friendId, isChannel } = props;
    const currentTime = getCurrentTimeStamp();
    const documentsStorage = firebase.storage().ref('file/documents/');
    const imagesStorage = firebase.storage().ref('file/images/');
    const [document, setDocument] = useState({ isDone: false, name: '', url: '', isUploading: false,
    progress: 0 });
    const [media, setMedia] = useState({ isDone: false, name: '', url: '', type: '', isUploading: false,
    progress: 0, });
    const listVideoType = [
        'webm', 
        'mkv', 
        'flv', 
        'vob', 
        'ogv', 
        'ogg', 
        'avi', 
        'mov', 
        'qt', 
        'mp4', 
        'm4p', 
        'm4v', 
        'mpg', 
        'mp2', 
        'mpeg', 
        'mpe', 
        'mpv', 
        '3gp'
    ];

    const handleFileSuccess = async filename => {
        const fileURL = await documentsStorage.child(filename).getDownloadURL();
        setDocument({ ...document, isDone: true, name: filename, url: fileURL });
    }

    const handleFileStart = () => {
        setDocument({ ...document, isUploading: true, progress: 0 });
    }

    const handleFileProgress = progress => {
        setDocument({ ...document, isUploading: true, progress: progress });
    }

    const handleFileError = error => {
        setDocument({ ...document, isUploading: false });
    }
    const handleMediaStart = () => {
        setMedia({ ...media, isUploading: true, progress: 0 });
    }

    const handleMediaProgress = progress => {
        setMedia({ ...media, isUploading: true, progress: progress });
    }

    const handleMediaError = error => {
        setMedia({ ...media, isUploading: false });
    }

    const handleMediaSuccess = async mediaSource => {
        const imageURL = await imagesStorage.child(mediaSource).getDownloadURL();
        if(listVideoType.includes(mediaSource.split('.')[1])) {
            setMedia({ ...media, type: 'video', isDone: true, name: mediaSource, url: imageURL })
        } else {
            setMedia({ ...media, type: 'image', isDone: true, name: mediaSource, url: imageURL })
        }
    }
    
    const cancelSendFile = () => {
        setDocument({ isDone: false, name: '', url: '' })
    }

    const sendFile = async () => {
        const messageId = generateId(userId, isChannel ? channelId : friendId, document.name)
        const newMessage = messageOnDB.child(`${conversationId}/listChat`).push();
        const newChannelMessage = DATABASE.ref(`/chatInChannel`).child(`${channelId}/listChat`).push();

        if(isChannel) {
            newChannelMessage.update({
                value: document.name,
                url: document.url,
                sendTime: currentTime,
                senderId: userId,
                receiverId: channelId,
                messageId,
                messageType: MESSAGE_TYPE.FILE,
                displayName,
                avatar
            })
        } else {
            newMessage.update({
                value: document.name,
                url: document.url,
                sendTime: currentTime,
                senderId: userId,
                receiverId: friendId,
                messageId,
                messageType: MESSAGE_TYPE.FILE,
                displayName,
                avatar
            })
        }
        
        setDocument({ isDone: false, name: '', url: '' })
    }
    const cancelSendImage = () => {
        setMedia({ isDone: false, name: '', url: '', type: '' })
    }

    const sendImage = async () => {
        const messageId = generateId(userId, isChannel ? channelId : friendId, document.name)
        const newMessage = messageOnDB.child(`${conversationId}/listChat`).push();
        const newChannelMessage = DATABASE.ref(`/chatInChannel`).child(`${channelId}/listChat`).push();
        const type = media.type === 'video' ? MESSAGE_TYPE.VIDEO : MESSAGE_TYPE.IMAGE;
        if(isChannel) {
            newChannelMessage.update({
                value: media.name,
                url: media.url,
                sendTime: currentTime,
                senderId: userId,
                receiverId: channelId,
                messageId,
                messageType: type,
                displayName,
                avatar
            })
        } else {
            newMessage.update({
                value: media.name,
                url: media.url,
                sendTime: currentTime,
                senderId: userId,
                receiverId: friendId,
                messageId,
                messageType: type,
                displayName,
                avatar
            })
        }
       
        setMedia({ isDone: false, name: '', url: '', type: '' })
    }
    return (
        <>
            {
                open ?
                    <div className="upload_file">
                        <div className="image_message">
                            <CustomUploadButton
                                accept="image/*, video/*"
                                storageRef={imagesStorage}
                                onUploadSuccess={handleMediaSuccess}
                                onUploadStart={handleMediaStart}
                                onUploadError={handleMediaError}
                                onProgress={handleMediaProgress}
                            >
                                <Image color="#000"/>
                            </CustomUploadButton>
                            {
                                media.isDone &&
                                <>
                                    <div className="preview_image">
                                        <div className="image">
                                            {
                                                media.type === 'video'
                                                ? <video autoPlay>
                                                    <source src={media.url}/>
                                                </video>
                                                : <DelayImage src={media.url}/>
                                            }
                                        </div>
                                        <div className="confirm_send">
                                            <Check onClick={sendImage}/>
                                            <X onClick={cancelSendImage}/>
                                        </div>
                                    </div>
                                    
                                </>
                            }
                        </div>

                        <div className="file_message">
                            <CustomUploadButton
                                accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf,.apk,.json,.rtf"
                                storageRef={documentsStorage}
                                onUploadSuccess={handleFileSuccess}
                                onUploadStart={handleFileStart}
                                onUploadError={handleFileError}
                                onProgress={handleFileProgress}
                            >
                                <File color="#000"/>
                            </CustomUploadButton>
                            {
                                document.isDone &&
                                <>
                                    <div className="preview_file">
                                        <p>{document.name}</p>
                                        <div className="confirm_send">
                                            <Check onClick={sendFile}/>
                                            <X onClick={cancelSendFile}/>
                                        </div>
                                    </div>
                                    
                                </>
                            }
                        </div>
                        {media.isUploading && <Progress className="progress_media" color="danger" value={media.progress} />}
                        {document.isUploading && <Progress className="progress_media" color="danger" value={document.progress} />}
                    </div>
                    : <div></div>
            }
        </>
        
    );
}

export default UploadFile;