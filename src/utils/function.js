import firebase from '../Firebase';

export const getDataOnDB = ( propName, value, ref ) => {
    const usersOnDB = firebase.database().ref(ref);
    return usersOnDB.orderByChild(propName).equalTo(value);
}