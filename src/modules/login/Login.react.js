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

        /*const appName = getUrlParam('appName') || 'xyj',
              token = getUrlParam('token') || 'R311nqHij/l8vllu7pE2McwMg8lniQMpFnT3fT8wTMbrdaRqoR4l9sxGnwrdp4chhCC3SZM8r1A8JRA5HHpbwZrRobnMXyCbCzNjLajr4LDfZbt8TLmdyvph6YX/HmlEvNPGxn8B27xrDly8C2zLE/jwHbH/IDZ8ILpRk5ZViVw=';
*/
        const appName = 'admin',
            token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJQQ-e9kemhtSIsInN1YiI6IntcInRva2VuXCI6XCIxOTQyMTcxYjkzMmQ0MmQ3YTIzNDE2ZGY1YThlMjhmMVwiLFwiY2xpZW50SWRcIjpcInN1cHBsaWVyXCIsXCJ1c2VySWRcIjpcIjExMVwiLFwiZ3JhbnRUeXBlXCI6XCJwYXNzd29yZFwiLFwidG9rZW5UeXBlXCI6XCJiZWFyZXJcIixcInNjb3BlXCI6XCJzdXBwbGllclwiLFwiY2xpZW50U291cmNlXCI6MSxcImV4cGlyZXNJblwiOjcyMDAsXCJ0b2tlbkV4cGlyZWREYXRlXCI6MTUwMzY0ODU0MX0iLCJpc3MiOiJzZXJ2aW5nY2xvdWQiLCJleHAiOjE1MDM2NDg1NDF9.Xw1VnCuovWBDXFvvDCo6f9OcfC9z3oI1jbIu6O0iBvZj6-F8iQPLAcFIW3-6xAmmUU06HKgjsoEEZcLOH8ydVYEz0hGhv65pVm-AiiYptx2hObHFO2LNAlQfsx3gqER6UyA-rGeU7lOLiQAFhIAKCXmDeSFpuozJ6DMr0enCAIY';

        this.mounted && this.setState({ refLoading: true });

        oauth.setToken(token);
        appName && token && request.post('/loginController/ssoLogin', {
            appName: appName,
            token : token,
        }).then(({data}) =>{
            if(data.code === 200){
                console.log(data.data);
                //保存token和用户信息
                oauth.setToken(data.data.token);
                oauth.setUser(data.data.sysUserBO);
                this.mounted && this.setState({ refLoading: false });
            }else{
                message.error(data.msg);
            }
        }).catch((data) => {

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
