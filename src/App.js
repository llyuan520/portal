import React, { Component } from 'react';
import {Layout,BackTop} from 'antd';
import {withRouter} from 'react-router-dom';
import {Headers,Footers} from './components';
import MainRoutes from './routes';

const { Content } = Layout;

class App extends Component {

    render() {


        return (

                <Layout className="layout">

                    <Headers />

                    <Content>
                        <MainRoutes />
                    </Content>

                    <Footers />

                    <BackTop />

                </Layout>

        );
    }
}

export default withRouter(App)
