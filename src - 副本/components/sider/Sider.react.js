/**
 * author       : liuliyuan
 * createTime   : 2017/9/22 11:35
 * description  :
 */
import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import {withRouter} from 'react-router-dom';

const { Sider } = Layout;


class PortalSider extends Component{
    //自行包装sider时要加入，为了让layout正确识别
    static __ANT_LAYOUT_SIDER = true
    constructor(props){
        super(props);
        this.state = {
            selectedPath:props.history.location.pathname
        };
    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){
        this.mounted && this.setState({
            selectedPath:nextProps.history.location.pathname,
        })
    }

    render(){

        return(
            <Sider
                trigger={null}
                collapsible
                style={{ background: '#fff' }}
            >
                <Menu
                    //theme='dark'
                    defaultSelectedKeys={[this.state.selectedPath]}
                    selectedKeys={[this.state.selectedPath]}
                    onSelect={
                        ({item,key,selectedKeys})=>{
                            this.props.history.replace(key)
                        }

                    }
                    mode="inline"
                >

                    {
                        this.props.menusData.map(item=>{
                            return (
                                <Menu.Item key={item.path}>
                                    <Icon type={item.icon}/>
                                    <span>{item.name}</span>
                                </Menu.Item>
                            )
                        })
                    }
                </Menu>
            </Sider>
        )
    }
}

export default withRouter(PortalSider);