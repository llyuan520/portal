/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 18:42
 * description  :
 */
import storage from '../store/storage'
import {configData} from '../config';

const TOKEN = 'TOKEN';
const USER = 'USER';

let token = null;
let user = null;

export default {
    /**
     * 是否登录
     */
    isLogin() {
        return !!this.getToken()
    },

    /**
     * 设置 token
     * @param value {string} 值
     */
    setToken(value) {
        token = value
        storage.set(TOKEN, token)
    },

    /**
     * 获取 token
     */
    getToken() {
        return token || storage.get(TOKEN)
    },

    /**
     * 设置用户
     * @param value {string} 值
     */
    setUser(value) {
        user = value
        storage.set(USER, user)
    },

    /**
     * 获取用户
     */
    getUser() {
        return user || storage.get(USER)
    },

    /**
     * 修改是否默认弹出新手引导
     */
    setTagSysUserBONotificationStatus(val){
        const data = storage.get(USER);
        data.sysUserBO.notificationStatus = val;
        storage.remove(USER);
        //保存token和用户信息
        this.setUser(data);
    },

    /**
     * 销毁 token 和 user
     */
    destroy() {
        token = user = null
        storage.remove(TOKEN)
        storage.remove(USER)
    },

    /**
     * 获取授权信息
     */
    getAuth() {
        return {
            auth: this.getToken(),
            username: this.getUser().sysUserBO.userName,
            administrator: this.getUser().sysUserBO.administrator,
            notificationStatus: this.getUser().sysUserBO.notificationStatus,
        }
    },

    /**
     * 退出登录
     */
    logout() {
        this.destroy();
        window.location.href=`${configData.address}wims/login.jsp`;
    }
}