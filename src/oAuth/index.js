/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 18:42
 * description  :
 */
import storage from '../store/storage'
import {configData} from '../config';

export default {
    /**
     * 是否登录
     */
    isLogin() {
        return !!this.getToken();
    },

    /**
     * 设置 token
     * @param value {string} 值
     */
    setToken(value) {
        storage.set('token', value)
    },

    /**
     * 获取 token
     */
    getToken() {
        return storage.get('token')
    },

    /**
     * 设置用户
     * @param value {string} 值
     */
    setUser(value) {
        storage.setObj('user', value)
    },

    /**
     * 获取用户
     */
    getUser() {
        return storage.getObj('user')
    },

    /**
     * 修改是否默认弹出新手引导
     */
    setTagSysUserBONotificationStatus(val){
        const data = storage.getObj('user');
        data.sysUserBO.notificationStatus = val;
        storage.remove('user');
        //保存token和用户信息
        this.setUser(data);
    },

    /**
     * 销毁 token 和 user
     */
    destroy() {
        storage.remove('token')
        storage.remove('user')
    },

    /**
     * 获取授权信息
     */
    getAuth() {
        return {
            auth: this.getToken(),
            username: this.getUser().sysUserBO.username,
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