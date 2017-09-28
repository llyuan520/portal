/**
 * author       : liuliyuan
 * createTime   : 2017/9/22 10:17
 * description  :
 */
import React, { Component } from 'react';
import {Layout,BackTop} from 'antd';
import {withRouter} from 'react-router-dom';
import {Headers,Footers,RouteWithSubRoutes} from '../../components';
import {Switch,Route } from 'react-router-dom';
import PortalBreadCrumb from '../../modules/breadcrumb/Breadcrumb'
import routes from '../../modules/sysManagement/routes'
import PortalSider from '../../components/sider'

const { Content } = Layout;

class SysManagement extends Component {
    render() {
        return (

            <Layout className="layout">

                <Headers  />

                <Content>
                    <Layout>

                        <div className="p-main">
                            <div className="mediaWidth" style={{  padding: '0' }}>
                                <Content>

                                    <PortalBreadCrumb  location={this.props.location} routes={routes}  />

                                    <Layout style={{padding: '24px 0', background: '#fff' }}>

                                        <PortalSider menusData={routes} />

                                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                                            <Switch>
                                                {
                                                    routes.map((item,i)=>(
                                                        item.subNav.map((route, i) => (
                                                            <RouteWithSubRoutes key={i} {...route}/>
                                                        ))
                                                    ))
                                                }
                                                <Route path="*" component={()=><div> 404 </div>} />
                                            </Switch>
                                        </Content>
                                    </Layout>

                                </Content>

                            </div>
                        </div>

                    </Layout>
                </Content>

                <Footers />

                <BackTop />

            </Layout>

        )
    }
}

export default withRouter(SysManagement)