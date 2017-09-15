/**
 * author       : liuliyuan
 * createTime   : 2017/9/14 18:08
 * description  :
 */
import request from './request.js';

const getQueryString=name=>{
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!==null) return decodeURI(r[2]); return null;
}

export { request,getQueryString }