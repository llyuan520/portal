/**
 * author       : liuliyuan
 * createTime   : 2017/9/22 10:17
 * description  :
 */
import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Layout,BackTop} from 'antd';
import {Headers,RouteWithSubRoutes} from '../../components';
import {Switch,Route } from 'react-router-dom';
import PortalBreadCrumb from '../../modules/breadcrumb/Breadcrumb'
import PortalSider from '../../components/sider'
import {copyRight} from "../../config/index";
import oauth from '../../oAuth';
import routes from './routes'
import {composeMenus} from '../../utils'
import './styles.css';

const { Header, Content,Footer } = Layout;

const menusData = composeMenus(routes);
class SysManagement extends Component {

    componentDidMount() {
    }

    componentWillMount(){
        if(!oauth.isLogin()){
            return oauth.logout();
        }
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);

    }

    render() {
        return (
            <Layout>
                <Header className="sys" style={{ padding: '0 24px'}} >
                    <Headers />
                </Header>
                <Layout>
                    <PortalSider menusData={menusData} />
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <PortalBreadCrumb  location={this.props.location} routes={routes}  />
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                            <Switch>
                                {
                                    routes.map((route,i)=>(
                                        <RouteWithSubRoutes key={i} {...route}/>
                                    ))
                                }
                                <Route path="*" component={()=><div> 404 </div>} />
                            </Switch>
                        </Content>

                        <Footer style={{ textAlign: 'center' }}>
                            {copyRight}
                        </Footer>

                        <BackTop />
                    </Layout>
                </Layout>
            </Layout>



        )
    }
}

export default withRouter(SysManagement)