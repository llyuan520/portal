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

class CompanySortSearch extends Component {
    state = {
        filters:{
            lastUpdated:Date.now()
        }
    };

    render(){
        return (
            <Layout>
                <Search search={(values,lastUpdated)=>{
                    this.setState({
                        filters:{
                            values,
                            lastUpdated
                        }
                    })
                }} />
                <Result lastUpdated={this.state.lastUpdated}  filters={this.state.filters} />
            </Layout>
        );
    }

}
export default CompanySortSearch