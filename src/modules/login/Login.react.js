/**
 * author       : liuliyuan
 * createTime   : 2017/9/25 15:13
 * description  :
 */
import React, { Component } from 'react';
import {Spin,message,Modal} from 'antd';
import {request,getUrlParam} from 'utils';
import {withRouter} from 'react-router-dom';
import {configData} from 'config';
import oauth from '../../oAuth';

const PiwikReactRouter = require('piwik-react-router');
class Login extends Component{

    state = {
        refLoading: false,
    }

    fetch = (appName,token) => {
        this.mounted && this.setState({ refLoading: true });
        appName && token && request.post('/loginController/ssoLogin', {
            appName: appName,
            token : token,
        }).then(({data}) =>{
            if(data.code === 200){
                oauth.destroy();

                //保存token和用户信息
                oauth.setToken(data.data.token);
                oauth.setUser(data.data);

                PiwikReactRouter({
                    //TODO: 测试环境地址，上线修改
                    url: configData.piwikData.URL,
                    siteId: configData.piwikData.siteId,
                    userId: oauth.getAuth().username,
                    trackErrors: true,
                });

                this.mounted && this.setState({ refLoading: false });

                this.props.history.push('/dashboard');

            }else{
                message.error(data.msg);

            }
        }).catch((data) => {
            console.log(data);
        })
    }

    componentWillMount(){
        const appName = getUrlParam('appName'),
              token = getUrlParam('token');

        if(oauth.isLogin()){
            return this.props.history.push('/dashboard');
        }else if(appName && token){
            this.fetch(appName,token);
        }else{
            Modal.warning({
                title: '系统提示',
                content: '当前用户不存在，请重新登录！',
                onOk: () => oauth.logout(),
            });
        }

    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }


    componentWillReceiveProps(nextProps){
        console.log(nextProps)
    }


    render(){
        return(
            <Spin size='small' spinning={this.state.refLoading}>

            </Spin>
        )
    }

}


export default withRouter(Login)
