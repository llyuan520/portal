/**
 * author       : liuliyuan
 * createTime   : 2017/9/14 18:08
 * description  :
 */
import request from './request.js';

//获取url中的参数
const getUrlParam = name =>{
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r !== null) return decodeURI(r[2]); return null; //返回参数值
}

//获取url参数
const getParameters = locationUrl =>{
    let url = decodeURI(locationUrl);//取访问地址url?后的部分
    let obj = new Object(); //返回对象
    let str;  //截取后的字符串
    let index = url.lastIndexOf('?');
    if(index !== -1) {
        url = url.slice(index+1, url.length);
        //两个参数以上的情况
        if(url.indexOf("&") !== -1) {
            str = url.split("&");
            for(let i = 0; i < str.length; i++) {
                let str1 = str[i].split("=");
                if(str1.length === 2 && str1[0] !== '') {
                    obj[str1[0]] = str1[1];
                }
            }
        }
        //一个参数的情况
        else {
            str = url.split("=");
            if(str.length === 2 && str[0] !== '') {
                obj[str[0]] = str[1];
            }
        }
    }
    return obj;
}

export { request,getUrlParam,getParameters }