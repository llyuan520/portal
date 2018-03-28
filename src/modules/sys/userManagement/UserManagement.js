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
        },
        params:{

        }
    };
    render(){
        return (
            <div>
                <Search
                    search={(values,lastUpdated)=>{
                        this.setState({
                            filters:{
                                values,
                                lastUpdated
                            }
                        })
                    }}
                    wrappedComponentRef={(inst) => this.formRef = inst}
                    onValuesChange={(values) => {
                        const newParams = {...this.formRef.props.form.getFieldsValue(), ...values};
                        if (newParams.createdDate && newParams.createdDate.length !== 0) {
                            newParams.createdDateStart = newParams.createdDate[0].format('YYYY-MM-DD')
                            newParams.createdDateEnd = newParams.createdDate[1].format('YYYY-MM-DD')
                            newParams.createdDate = undefined;
                        }
                        this.setState({
                            params: newParams
                        })
                    }}
                />
                <Result filters={this.state.filters} params={this.state.params}/>
            </div>
        );
    }

}
export default UserManagement