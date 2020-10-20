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

export const setExpiredTimeWorkSpace = async (dataOnDB, propertyValue, propertyKey) => {
    await dataOnDB.once('value', response => {
        const value = response.val();
        const key = Object.keys(value).find(key => value[key][propertyKey] === propertyValue); // get key of workspace
        console.log('%c key: ', 'color: red' , key);
        const setExpiredDateOnDB = dataOnDB.child(key);
        const expiredTime = moment().add(EXPIRED_TIME, 'minutes').format('DDMMYYYYHHmm');
        setExpiredDateOnDB.update({ "expiredTimeWorkSpace": expiredTime }) // update expired time 
        localStorage.setItem("expiredTimeWorkSpace", expiredTime);
    })
}
export const setExpiredTimeUserSession = async (dataOnDB, propertyValue, propertyKey) => {
    await dataOnDB.once('value', response => {
        const value = response.val();
        const key = Object.keys(value).find(key => value[key][propertyKey] === propertyValue);
        const setExpiredDateOnDB = dataOnDB.child(key);
        const expiredTime = moment().add(EXPIRED_TIME, 'minutes').format('DDMMYYYYHHmm');
        setExpiredDateOnDB.update({ "expiredTimeUserSession": expiredTime }) // update expired time 
        localStorage.setItem("expiredTimeUserSession", expiredTime);
    })
}

export const checkExpire = (target) => {
    const expiredTime = localStorage.getItem(target);
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