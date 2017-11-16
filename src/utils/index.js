/**
 * author       : liuliyuan
 * createTime   : 2017/9/14 18:08
 * description  :
 */
import React from 'react';
import request from './request.js';
import {configData} from './../config';
import DocumentTitle from 'react-document-title'
import composeMenus from './composeMenus'

export const wrapPage = (title,Component) => props => <DocumentTitle title={`${title}`}>{<Component {...props}/>}</DocumentTitle>

//获取url中的参数
const getUrlParam = name =>{
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r !== null) return decodeURI(r[2]); return null; //返回参数值
}

//获取url参数
const getParameters = locationUrl =>{
    let url = decodeURI(locationUrl);//取访问地址url?后的部分
    let obj = {}; //返回对象
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

/**
 * 判断是否为空
 * @param val {string} 字符串
 */
const isEmpty = val=> {
    return val === null || val === undefined || val.trim() === ''
}

//千位号
const fMoney = (s,n=2)=>{

    if(s === "" || s === 0 || typeof (s) === 'undefined'){
        return '0.00';
    }else{
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\\.-]/g, "")).toFixed(n) + "";

        let l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        let t = "";
        for(let i = 0; i < l.length; i ++ )
        {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }
}

/**
 * author       : liuliyuan
 * createTime   : 2017/9/22 15:59
 * description  : 参考地址 http://npm.taobao.org/package/react-piwik
 *              ： https://github.com/joernroeder/piwik-react-router
 */
const PiwikReactRouter = require('piwik-react-router');

const piwik = PiwikReactRouter({
    //TODO: 测试环境地址，上线修改
    url: configData.piwikData.URL,
    siteId: configData.piwikData.siteId,
    //userId: oauth.getAuth().userName || '',
    trackErrors: true,
});

//获取html
const htmlDecode = html =>{
    if(html){
        let div = document.createElement( 'div' );
        div.innerHTML = html;
        return div.textContent;
    }
};



export { request,getUrlParam,getParameters,fMoney,isEmpty,piwik,composeMenus,htmlDecode}