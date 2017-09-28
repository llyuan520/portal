/**
 * author       : liuliyuan
 * createTime   : 2017/9/21 16:01
 * description  :
 */
import React, { Component } from 'react';
import Search from './Search.react'
import Result from './Result.react'
import {Layout} from 'antd'
import '../styles.css';

class CompanyInfoSearch extends Component {
    state = {
        filters:{
            lastUpdated:Date.now()
        }
    };

    render(){
        return (
            <Layout>
                <Search />
                <Result />
            </Layout>
        );
    }

}
export default CompanyInfoSearch