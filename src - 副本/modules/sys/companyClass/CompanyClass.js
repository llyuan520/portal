/**
 * author       : liuliyuan
 * createTime   : 2017/9/21 16:01
 * description  :
 */
import React, { Component } from 'react';
import Search from './Search.react'
import Result from './Result.react'

class CompanyClass extends Component {
    state = {
        filters:{
            lastUpdated:Date.now()
        }
    };

    refreshCurdTableTree = ()=>{
        this.setState({
            refKeyDate:Date.now()
        })
    }

    render(){
        return (
            <div>
                <Search search={(values,lastUpdated)=>{
                    this.setState({
                        filters:{
                            values,
                            lastUpdated
                        }
                    })
                }} />
                <Result key={this.state.refKeyDate} filters={this.state.filters} refreshCurdTableTree={this.refreshCurdTableTree.bind(this)}  />
            </div>
        );
    }

}
export default CompanyClass