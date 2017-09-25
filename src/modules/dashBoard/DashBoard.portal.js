/**
 * author       : liuliyuan
 * createTime   : 2017/9/25 15:35
 * description  :
 */
import React, { Component } from 'react';
import {Headers,Footers,RouteWithSubRoutes} from '../../components'
import {Switch,Route } from 'react-router-dom';
import {Layout,BackTop } from 'antd'

//首页路由配置
import {routes} from '../portal'

const { Content } = Layout;
class DashBoard extends Component {

    /*componentWillMount(){
        const props = this.props;

        if(!props.isAuthenticated){
            props.history.replace('/login');
        }

    }

    componentWillReceiveProps(nextPros){
        const props = nextPros;
        if(!props.isAuthenticated){
            props.history.replace('/login');
        }
    }*/
    render() {
        return (
                <Layout className="layout">

                    <Headers  />

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

