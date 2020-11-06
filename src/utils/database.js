import firebase from 'firebase';

export const userOnDB = firebase.database().ref('/user/list');
export const workspaceOnDB = firebase.database().ref('/workspace/list');
export const directMessageOnDB = firebase.database().ref('/directMessage');
export const messageOnDB = firebase.database().ref('/chatInDirectMessage');
export const channelOnDB = firebase.database().ref('/listChannel');
export const userInChannelOnDB = firebase.database().ref('/userInChannel');
export const chatInChannelOnDB = firebase.database().ref('/chatInChannel');

export const getData = async (database, key, value) => {
    let data = {};
    await database.orderByChild(key).equalTo(value).once('value', response => {
        if(response.exists()) {
            data = response.val() && Object.values(response.val());
        }
    })
    return data;
}