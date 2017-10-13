/**
 * author       : liuliyuan
 * createTime   : 2017/9/6 17:53
 * description  :
 */

import React,{ Component } from 'react';
import { Menu,Row,Col,Icon,Avatar,Modal,Badge} from 'antd';
import {withRouter,Link} from 'react-router-dom';
import {messageInfo} from "../../config/index";
import oauth from '../../oAuth';
import NoviceGuide from './NoviceGuide'

import logoImg from './media/logo-02.png';
const SubMenu = Menu.SubMenu;
const confirm = Modal.confirm;

class Headers extends Component{
    constructor(props){
        super(props);
        this.state = {
            userName: '',
            current: '',
            selectedPath:props.history.location.pathname,
            modalVisible: false,
            modalClassKey:Date.now()+'1',
        };
    }

    handleClick = ({item, key, keyPath})=>{
        if(this.state.selectedPath.indexOf(key) === 1){
            this.mounted && this.setState({
                current: key,
            });
        }

        if(key==='messages'){
            this.props.history.push('/dashboard');
        }else if(key==='sysManagement'){
            this.props.history.push('/sysManagement');
        }else if(key === 'noviceGuide'){
            this.setModalVisible(true);
        }
    }

    setModalVisible= status=>{
        this.mounted && this.setState({
            modalVisible:status,
            modalClassKey:Date.now()
        })
    }

    componentDidMount() {
        let key ='';

        if(this.state.selectedPath.indexOf('messages') === 1){
            key = 'messages';
        }else if(this.state.selectedPath.indexOf('sysManagement') === 1){
            key = 'sysManagement';
        }

        this.mounted && this.setState({
            current: key,
        });

        if(!!oauth.getUser() && !!oauth.getToken()){
            if(oauth.getAuth()){
                this.mounted && this.setState({
                    userName : oauth.getAuth().username
                })
            }
        }else{
            oauth.logout()
        }
    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillMount(){

    }

    componentWillReceiveProps(nextProps){
        this.mounted && this.setState({
            selectedPath:nextProps.location.pathname
        })
    }

    render(){
        return(
            <div>
                <Row>
                    <Col span={14}>

                        <div className="logo hide">
                            <Link to="/dashboard/home">
                                <img src={logoImg} alt="logo" />
                            </Link>
                        </div>
                        <StartMarquee />

                    </Col>
                    <Col span={10}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            onClick={this.handleClick}
                            selectedKeys={[this.state.current]}
                            className="p-menu-root"
                            style={{ lineHeight: '64px',float:'right' }}
                        >
                            <Menu.Item key="messages">
                                <Badge count={199}>
                                    <Icon type="mail" style={{fontSize: 24}} />
                                </Badge>
                                消息
                            </Menu.Item>
                            <Menu.Item key="noviceGuide">
                                新手引导
                            </Menu.Item>
                            <SubMenu
                                title={
                                    <span>
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{ verticalAlign:'middle',marginRight:'10px' }} />
                                        { this.state.userName }
                                </span>}>
                                <Menu.Item key="sysManagement">
                                <span style={{display:'block',textAlign:'left',color:'#333'}}>
                                    <Icon type="user" />
                                    管理员入口
                                </span>
                                </Menu.Item>
                                <Menu.Item key="logout">
                                <span onClick={()=> {
                                    confirm({
                                        title: '系统提示',
                                        content: '确定要退出吗',
                                        onOk: () => oauth.logout(),
                                        onCancel() { },
                                    });
                                }} style={{display:'block',textAlign:'left',color:'#333'}} >
                                    <Icon type="logout" />
                                    退出
                                </span>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Col>
                </Row>

                {/*新手引导*/}
                <NoviceGuide key={this.state.modalClassKey} modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible.bind(this)} />
            </div>
        )
    }
}

export default withRouter(Headers)


let timer = null;
class StartMarquee extends Component {

    state={
        speed: 1500,
    }

    marquee=()=>{
        let element=document.getElementById("hotNews"),
            element1=document.getElementById("hotNews1");

        if(element1.offsetHeight - element.scrollTop <= 0) {
            element.scrollTop -= element1.offsetHeight;
        } else{
            element.scrollTop++
        }

        if (parseInt(element.scrollTop, 0) % 22 !== 0) {
            timer = setTimeout(()=>{this.marquee()}, 20); //后面的值如果设置成一样的是连续无痕滚动 如果有间隔就是一个一个弹出
        } else {
            timer = setTimeout(()=>{this.marquee()}, this.state.speed);
        }
    }

    handelOnMouserOver=()=>{
        clearTimeout(timer)
    }

    handelOnMouseOut=()=> {
        timer = setTimeout(()=>{this.marquee()}, this.state.speed);
    }


    componentDidMount(){
        //获取滚动部分
        let element1=document.getElementById("hotNews1"),
            element2=document.getElementById("hotNews2");

        element2.innerHTML += element1.innerHTML;
        clearTimeout(timer);
        timer = setTimeout(()=>{this.marquee()}, this.state.speed);
    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps) {

    }

    render(){



        return(
            <div className="hide">
                <Icon type="sound" style={{ position: 'absolute',fontSize: 16,color:'#fff',verticalAlign:'middle',marginRight:'10px',top:'24px' }} />
                <div id="hotNews" className="q-hotNews" onMouseOver={this.handelOnMouserOver} onMouseOut={this.handelOnMouseOut}>
                    <ul id="hotNews1">
                        {
                            messageInfo.map((item,i)=>{
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
