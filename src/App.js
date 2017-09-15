import React, { Component } from 'react';
import {Layout} from 'antd';
import {Headers,Footers} from './components';
import MainRoutes from './routes';

const { Content } = Layout;

class App extends Component {
    render() {
        return (
            <Layout className="layout">

                <Headers />

                <Content style={{ padding: '0 50px' }}>
                    <div className="mediaWidth" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <MainRoutes />
                    </div>
                </Content>

                <Footers />

            </Layout>
        );
    }
}

export default App;
