/**
 * author       : liuliyuan
 * createTime   : 2017/9/15 11:07
 * description  :
 */
import Store from '../store/es6-store';

// Add JWT methods here
const parseJwt = token =>{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
    // return JSON.parse(decodeURIComponent(escape($window.atob(base64))));
}

const setToken = token =>{
    Store.set('jwtToken', token);
}

const getToken = () =>{
    return Store.get('jwtToken');
}

const setUser = user =>{
    Store.set('currentUser', user);
}

const getUser = () =>{
    return Store.get('currentUser');
}

const isAuthed = () =>{
    let token = this.getToken();
    let user = this.getUser();
    if(token && user) {
        return true;
    } else {
        return false;
    }
}

const logout = () =>{
    Store.remove('jwtToken');
    Store.remove('currentUser');
}


export default {
    parseJwt,
    setToken,
    getToken,
    setUser,
    getUser,
    isAuthed,
    logout
}