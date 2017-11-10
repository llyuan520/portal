import React, { Component } from 'react';
import {Layout} from 'antd';
import {withRouter} from 'react-router-dom';
import MainRoutes from './routes';

class App extends Component {

    componentDidMount() {

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){


    }


    render() {


        return (
                <Layout>
                    <MainRoutes />
                </Layout>

        );
    }
}

export default withRouter(App)
