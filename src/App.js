import React, { Component } from 'react';
import {Layout,BackTop,Menu, Icon } from 'antd';
import {withRouter} from 'react-router-dom';
import {Headers,Footers} from './components';
import MainRoutes from './routes';
import PortalBreadCrumb from './modules/breadcrumb/Breadcrumb'
import routes from './modules/sysManagement/routes'

const { Content,Sider } = Layout;
const { SubMenu } = Menu;

class App extends Component {
    render() {
        const { match, location, history } = this.props;
        console.log(match, location, history);
        let pathname = parseInt(location.pathname.indexOf('admin'),0);
        return (
            <Layout className="layout">

                <Headers />

                {
                    pathname === 1 ? <AdminContent location={this.props.location} routes={routes} /> : <UserContent />
                }

                <Footers />

                <BackTop />

            </Layout>
        );
    }
}

export default withRouter(App)


const UserContent =()=> <Content>
                        <MainRoutes />
                    </Content>


const AdminContent = (props) => <Content style={{ padding: '0 50px' }}>

                                    <PortalBreadCrumb  {...props}  />

                                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                                        <Sider width={200} style={{ background: '#fff' }}>
                                            <Menu
                                                mode="inline"
                                                defaultSelectedKeys={['1']}
                                                defaultOpenKeys={['sub1']}
                                                style={{ height: '100%' }}
                                            >
                                                <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                                                    <Menu.Item key="1">option1</Menu.Item>
                                                    <Menu.Item key="2">option2</Menu.Item>
                                                    <Menu.Item key="3">option3</Menu.Item>
                                                    <Menu.Item key="4">option4</Menu.Item>
                                                </SubMenu>
                                                <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                                                    <Menu.Item key="5">option5</Menu.Item>
                                                    <Menu.Item key="6">option6</Menu.Item>
                                                    <Menu.Item key="7">option7</Menu.Item>
                                                    <Menu.Item key="8">option8</Menu.Item>
                                                </SubMenu>
                                                <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
                                                    <Menu.Item key="9">option9</Menu.Item>
                                                    <Menu.Item key="10">option10</Menu.Item>
                                                    <Menu.Item key="11">option11</Menu.Item>
                                                    <Menu.Item key="12">option12</Menu.Item>
                                                </SubMenu>
                                            </Menu>
                                        </Sider>
                                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                                            <MainRoutes />
                                        </Content>
                                    </Layout>
                                </Content>