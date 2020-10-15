import firebase from '../Firebase';

export const getDataOnDB = ( propName, value, ref ) => {
    const usersOnDB = firebase.database().ref(ref);
    return usersOnDB.orderByChild(propName).equalTo(value);
}

export const validateWorkspace = (workspace) => {
    const nameRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return nameRegex.test(workspace)
}
