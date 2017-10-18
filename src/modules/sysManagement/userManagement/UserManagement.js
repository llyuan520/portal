/**
 * author       : liuliyuan
 * createTime   : 2017/10/17 15:22
 * description  :
 */
import React, { Component } from 'react';
import Search from './Search.react'
import Result from './Result.react'

class UserManagement extends Component {
    state = {
        filters:{
            lastUpdated:Date.now()
        }
    };

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
                <Result filters={this.state.filters} />
            </div>
        );
    }

}
export default UserManagement