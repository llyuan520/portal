/**
 * author       : liuliyuan
 * createTime   : 2017/9/22 11:35
 * description  :
 */
import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
const { SubMenu } = Menu;
const { Sider } = Layout;



class PortalSider extends Component{
    //自行包装sider时要加入，为了让layout正确识别
    static __ANT_LAYOUT_SIDER = true
    constructor(props){
        super(props);
        this.state = {
            collapsed: true,
            selectedPath:props.history.location.pathname
        };
    }

    toggle = () => {
        this.mounted && this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
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

        let data = this.props.menusData;
        let subKey = '';
        for(let i=0; i<data.length; i++){
            for(let j=0; j<data[i].subNav.length; j++){
                if(data[i].subNav[j].path === this.state.selectedPath){
                    subKey = data[i].subKey;
                }
            }
        }

        return(
            <Sider
                width={200}
                style={{ background: '#fff' }}>

                <Menu
                    mode="inline"
                    style={{ height: '100%',border:0, }}

                    defaultSelectedKeys={[this.state.selectedPath]}
                    defaultOpenKeys={[subKey]}

                    selectedKeys={[this.state.selectedPath]}
                    onSelect={
                        ({item,key,selectedKeys})=>{
                            this.props.history.replace(key)
                        }

                    }
                >

                    {
                        this.props.menusData.map((item,i)=>(
                            <SubMenu key={item.subKey}
                                     title={
                                         <span>
                                             <Icon type={item.icon} />
                                             {item.name}
                                         </span>
                                     }>
                                {
                                    item.subNav.length >0 && item.subNav.map(subItem=>{
                                        return(

                                            <Menu.Item key={subItem.path}>
                                                <Icon type={subItem.icon} />
                                                <span>{subItem.name}</span>
                                            </Menu.Item>
                                        )
                                    })
                                }
                            </SubMenu>
                        ))
                    }

                </Menu>
            </Sider>
        )
    }
}

export default withRouter(PortalSider);