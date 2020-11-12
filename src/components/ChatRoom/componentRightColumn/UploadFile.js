import React, { useState } from 'react';
import { Check, File, Image, X } from 'react-feather';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import firebase from 'firebase';
import { DATABASE, messageOnDB } from '../../../utils/database';
import { generateId, getCurrentTimeStamp } from '../../../utils/function';
import { MESSAGE_TYPE } from '../../../utils/constant';

const UploadFile = props => {
    const { channelId, open, conversationId, userId, displayName, avatar, friendId, isChannel } = props;
    const currentTime = getCurrentTimeStamp();
    const documentsStorage = firebase.storage().ref('file/documents/');
    const imagesStorage = firebase.storage().ref('file/images/');
    const [document, setDocument] = useState({ isDone: false, name: '', url: '' });
    const [image, setImage] = useState({ isDone: false, name: '', url: '' });

    const handleFileSuccess = async filename => {
        const fileURL = await documentsStorage.child(filename).getDownloadURL();
        setDocument({ isDone: true, name: filename, url: fileURL });
    }

    const handleImageSuccess = async image => {
        const imageURL = await imagesStorage.child(image).getDownloadURL();
        setImage({ isDone: true, name: image, url: imageURL });
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
        setImage({ isDone: false, name: '', url: '' })
    }

    const sendImage = async () => {
        const messageId = generateId(userId, isChannel ? channelId : friendId, document.name)
        const newMessage = messageOnDB.child(`${conversationId}/listChat`).push();
        const newChannelMessage = DATABASE.ref(`/chatInChannel`).child(`${channelId}/listChat`).push();

        if(isChannel) {
            newChannelMessage.update({
                value: image.name,
                url: image.url,
                sendTime: currentTime,
                senderId: userId,
                receiverId: channelId,
                messageId,
                messageType: MESSAGE_TYPE.IMAGE,
                displayName,
                avatar
            })
        } else {
            newMessage.update({
                value: image.name,
                url: image.url,
                sendTime: currentTime,
                senderId: userId,
                receiverId: friendId,
                messageId,
                messageType: MESSAGE_TYPE.IMAGE,
                displayName,
                avatar
            })
        }
       
        setImage({ isDone: false, name: '', url: '' })
    }
    return (
        <>
            {
                open ?
                    <div className="upload_file">
                        <div className="image_message">
                            <CustomUploadButton
                                accept="image/*"
                                storageRef={imagesStorage}
                                onUploadSuccess={handleImageSuccess}
                            >
                                <Image color="#000"/>
                            </CustomUploadButton>
                            {
                                image.isDone &&
                                <>
                                    <div className="preview_image">
                                        <div className="image">
                                            <img src={image.url}/>
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
                    </div>
                    : <div></div>
            }

        </>
        
    );
}

export default UploadFile;