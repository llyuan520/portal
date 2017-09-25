/**
 * author       : liuliyuan
 * createTime   : 2017/9/25 15:13
 * description  :
 */
import React, { Component } from 'react';
import {Spin,message} from 'antd';
import {request,getUrlParam} from '../../utils';
import {withRouter} from 'react-router-dom';
import oauth from '../../oAuth';
class Login extends Component{

    state = {
        refLoading: false,
    }

    fetch = () => {

        const appName = getUrlParam('appName'),
              token = getUrlParam('token');
              oauth.setToken(token);

        this.mounted && this.setState({ refLoading: true });
        appName && token && request.post('/loginController/ssoLogin', {
            appName: appName,
            token : token,
        }).then(({data}) =>{
            console.log(data.data);

            if(data.code === 200){
                //保存token和用户信息
                oauth.setToken(data.data.token);
                oauth.setUser(data.data.sysUserBO);
                this.mounted && this.setState({ refLoading: false });
                this.props.history.push('/dashboard');
            }else{
                message.error(data.msg);
            }
        }).catch((data) => {
            console.log(data);
        })
    }

    componentDidMount() {
        this.mounted && this.fetch();
    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillMount(){
        if(oauth.isLogin()){
            this.props.history.push('/dashboard')
        }
    }

    componentWillReceiveProps(nextProps){

    }


    render(){
        return(
            <Spin size='small' spinning={this.state.refLoading}>

            </Spin>
        )
    }

}

export default withRouter(Login)
