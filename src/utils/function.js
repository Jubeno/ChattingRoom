import firebase from '../Firebase';
import moment from 'moment';
import { EXPIRED_TIME } from './constant';

export const getDataOnDB = ( propName, value, ref ) => {
    const usersOnDB = firebase.database().ref(ref);
    return usersOnDB.orderByChild(propName).equalTo(value);
}

export const validateWorkspace = (workspace) => {
    const nameRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return nameRegex.test(workspace)
}

export const generateKey = () => `_${Math.random().toString(36).substr(2, 9)}`;

export const setToken = async (dataOnDB, propertyValue, propertyKey, dataUser) => {
    await dataOnDB.once('value', response => {
        const value = response.val();
        const key = Object.keys(value).find(key => value[key][propertyKey] === propertyValue);
        const setExpiredDateOnDB = dataOnDB.child(key);
        const expiredTime = moment().add(EXPIRED_TIME, 'minutes').format('DDMMYYYYHHmm');
        const data = {
            userId: dataUser[0].userID,
            expiredTime
        }
        setExpiredDateOnDB.update({ "token": btoa(JSON.stringify(data)) }) // update expired time 
        localStorage.setItem("token", btoa(JSON.stringify(data)) );
    })
}

export const checkExpire = (target) => {
    const token = localStorage.getItem(target);
    const decode = JSON.parse(atob(token));
    const expiredTime = decode.expiredTime;
    let result = true;
    if( expiredTime === null ) {
        result = false;
    } else {
        const currentTime = moment().format('YYYY-MM-DD HH:mm');
        const expiredTimeFormated = moment(expiredTime, 'DDMMYYYYHHmm').format('YYYY-MM-DD HH:mm');
        const isBefore = moment(currentTime).isBefore(expiredTimeFormated);
        if( !isBefore ) {
            result = false;
        }
    }
    return result;
}

export const getKeyByProperty = (value, propertyKey, propertyValue) => {
    return Object.keys(value).find(key => value[key][propertyKey] === propertyValue);
}

export const getCurrentTimeStamp = () => moment().valueOf();

export const generateId = (a = '', b = '', c = '') => btoa(`${a}-${b}-${c}`);