/**
 * author       : liuliyuan
 * createTime   : 2017/9/6 17:53
 * description  :
 */

import React,{ Component } from 'react';
import { Layout,Menu,Row,Col,Icon,Avatar,Badge} from 'antd';
import {Link} from 'react-router-dom';
import {message} from "../../config/index";
import './Header.less';
import logoImg from './media/logo-02.png';
const { Header } = Layout;
const { SubMenu } = Menu;

class Headers extends Component{
    render(){
        return(
            <Header className="header">
                <Row className="mediaWidth">
                    <Col span={14}>
                        <div className="logo">
                            <Link to="/home">
                                <img src={logoImg} alt="logo" />
                            </Link>
                        </div>

                        <StartMarquee />

                    </Col>
                    <Col span={10}>

                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            className="menu"
                            style={{ lineHeight: '64px',float:'right' }}
                        >
                            <Menu.Item key="1">
                                <Link to="/about">
                                    <Badge count={199}>
                                        <Icon type="mail" style={{fontSize: 24}} />
                                    </Badge>
                                    消息
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{ verticalAlign:'middle',marginRight:'10px' }} />
                                123066
                            </Menu.Item>
                        </Menu>
                    </Col>
                </Row>



            </Header>
        )
    }
}

export default Headers


let timer = null;
class StartMarquee extends Component {

    state={
        speed: 100,
        element:'',
        element1:'',
        element2:'',

    }

    componentDidMount(){

        //获取滚动部分
        let element=document.getElementById("hotNews"),
            element1=document.getElementById("hotNews1"),
            element2=document.getElementById("hotNews2");

        this.setState({
            element:element,
            element1:element1,
            element2:element2,
        })

        element2.innerHTML += element1.innerHTML;
        clearTimeout(timer);
        timer = setTimeout(()=>{this.marquee()}, this.state.speed);
    }

    marquee=()=>{

        if(this.state.element1.offsetHeight-this.state.element.scrollTop<=0)
            this.state.element.scrollTop -= this.state.element1.offsetHeight;
        else{
            this.state.element.scrollTop++
        }

        if (parseInt(this.state.element.scrollTop) % 22 !== 0) {
            timer = setTimeout(()=>{this.marquee()}, 20); //后面的值如果设置成一样的是连续无痕滚动 如果有间隔就是一个一个弹出
        } else {
            timer = setTimeout(()=>{this.marquee()}, 1500);
        }
    }

    handelOnMouserOver=()=>{
        clearTimeout(timer)
    }

    handelOnMouseOut=()=> {
        timer = setTimeout(()=>{this.marquee()}, this.state.speed);
    }


    render(){

        return(
            <div>
                <Icon type="sound" style={{ position: 'absolute',fontSize: 16,color:'#fff',verticalAlign:'middle',marginRight:'10px',top:'24px' }} />
                <div id="hotNews" className="q-hotNews" onMouseOver={this.handelOnMouserOver} onMouseOut={this.handelOnMouseOut}>
                    <ul id="hotNews1">
                        {
                            message.map((item,i)=>{
                                return(
                                    <li key={i}>
                                        <a title={item.title} href={item.url} style={{color:'#fff'}}>
                                            {item.title}
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul id="hotNews2">

                    </ul>
                </div>
            </div>
        )

    }
}
