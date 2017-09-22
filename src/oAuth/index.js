/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 18:42
 * description  :
 */
import storage from '../store/storage'

const TOKEN = 'TOKEN'
const USER = 'USER'

let token = null;
let user = null;

/*let token = null || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJQQ-e9kemhtSIsInN1YiI6IntcInRva2VuXCI6XCIxOTQyMTcxYjkzMmQ0MmQ3YTIzNDE2ZGY1YThlMjhmMVwiLFwiY2xpZW50SWRcIjpcInN1cHBsaWVyXCIsXCJ1c2VySWRcIjpcIjExMVwiLFwiZ3JhbnRUeXBlXCI6XCJwYXNzd29yZFwiLFwidG9rZW5UeXBlXCI6XCJiZWFyZXJcIixcInNjb3BlXCI6XCJzdXBwbGllclwiLFwiY2xpZW50U291cmNlXCI6MSxcImV4cGlyZXNJblwiOjcyMDAsXCJ0b2tlbkV4cGlyZWREYXRlXCI6MTUwMzY0ODU0MX0iLCJpc3MiOiJzZXJ2aW5nY2xvdWQiLCJleHAiOjE1MDM2NDg1NDF9.Xw1VnCuovWBDXFvvDCo6f9OcfC9z3oI1jbIu6O0iBvZj6-F8iQPLAcFIW3-6xAmmUU06HKgjsoEEZcLOH8ydVYEz0hGhv65pVm-AiiYptx2hObHFO2LNAlQfsx3gqER6UyA-rGeU7lOLiQAFhIAKCXmDeSFpuozJ6DMr0enCAIY';
let user = null || {
    username:'admin',
    Authority:'1',
};*/
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
            username: this.getUser().username
        }
    }
}