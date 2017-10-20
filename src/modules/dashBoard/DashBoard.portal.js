/**
 * author       : liuliyuan
 * createTime   : 2017/9/25 15:35
 * description  :
 */
import React, { Component } from 'react';
import {Layout,BackTop} from 'antd';
import {Headers,Footers,RouteWithSubRoutes} from '../../components'
import {Switch,Route } from 'react-router-dom';
import oauth from '../../oAuth';
import '../../components/header/Header.less';

//首页路由配置
import {routes} from '../portal'

const { Content,Header } = Layout;
class DashBoard extends Component {


    componentWillMount(){
        if(!oauth.isLogin()){
            return oauth.logout();
        }
    }

    componentWillReceiveProps(nextProps){
        //console.log(nextProps);

    }


    render() {
        return (
                <Layout className="layout">

                    <Header className="header user">
                        <div className="mediaWidth">
                            <Headers />
                        </div>
                    </Header>

                    <Content>
                        <Switch>
                            {routes.map((route, i) => (
                                <RouteWithSubRoutes key={i} {...route}/>
                            ))}
                            <Route path="*" component={()=><div>no match</div>} />
                        </Switch>
                    </Content>

                    <Footers />

                    <BackTop />

                </Layout>
        );
    }
}

export default DashBoard;

