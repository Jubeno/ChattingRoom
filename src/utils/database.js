import firebase from 'firebase';

export const userOnDB = firebase.database().ref('/user/list');
export const workspaceOnDB = firebase.database().ref('/workspace/list');
export const directMessageOnDB = firebase.database().ref('/directMessage');
export const channelOnDB = firebase.database().ref('/listChannel');
export const userInChannelOnDB = firebase.database().ref('/userInChannel');
export const chatInChannelOnDB = firebase.database().ref('/chatInChannel');