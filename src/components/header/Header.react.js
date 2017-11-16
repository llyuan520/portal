/**
 * author       : liuliyuan
 * createTime   : 2017/9/6 17:53
 * description  :
 */

import React,{ Component } from 'react';
import { Menu,Row,Col,Icon,Avatar,Modal} from 'antd';
import {withRouter,Link} from 'react-router-dom';
import oauth from '../../oAuth';
import NoviceGuide from './NoviceGuide'
import {request,htmlDecode} from '../../utils';

import logoImg from './media/logo-02.png';
const SubMenu = Menu.SubMenu;
const confirm = Modal.confirm;

class Headers extends Component{
    constructor(props){
        super(props);
        this.state = {
            userName: '',
            administrator:0, //是否管理员  0否，1是
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
        }else if(key==='sys'){
            this.props.history.push('/sys');
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
        }else if(this.state.selectedPath.indexOf('sys') === 1){
            key = 'sys';
        }

        this.mounted && this.setState({
            current: key,
        });

        if(!!oauth.getUser() && !!oauth.getToken()){
            if(oauth.getAuth()){
                this.mounted && this.setState({
                    userName : oauth.getAuth().username,
                    administrator: oauth.getAuth().administrator,
                    notificationStatus:oauth.getAuth().notificationStatus,
                },()=>{

                    //默认判断是否已经自动弹出
                    if(parseInt(oauth.getUser().sysUserBO.notificationStatus, 0) === 0){
                        this.setModalVisible(true);
                        request.post('/userManage/modifyNotificationStatus', {
                            userName: this.state.userName,
                            notificationStatus: 1
                        }).then(({data}) => {
                            if(data.code === 200){
                                oauth.setTagSysUserBONotificationStatus(1);
                            }
                        }).catch(err => {

                        })
                    }

                    //获取公告弹窗信息
                    request.get('/announcement/findPublishAnnouncement', {
                    }).then(({data}) => {
                        if (data.code === 200) {
                            if(data.data){
                                let ref = Modal.warning({
                                    iconType:'notification',
                                    title: '系统提示',
                                    content: ModelContext(data.data),
                                    okText:'关闭',
                                    width:'600px',
                                    onOk () {
                                        ref.destroy();
                                    },
                                });
                            }
                        }
                    })
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
                        {/*
                            //TODO: 设置公告信息位置
                        */}
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
                            <Menu.Item key="noviceGuide">
                                新手引导
                            </Menu.Item>
                            {/*<Menu.Item key="messages">
                                <Badge count={199}>
                                    <Icon type="mail" style={{fontSize: 24}} />
                                </Badge>
                                消息
                            </Menu.Item>*/}
                            <SubMenu
                                title={
                                    <span>
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{ verticalAlign:'middle',marginRight:'10px' }} />
                                        { this.state.userName }
                                </span>}>
                                {
                                    this.state.administrator === 1 && <Menu.Item key="sys">
                                    <span style={{display:'block',textAlign:'left',color:'#333'}}>
                                        <Icon type="user" />
                                        管理员入口
                                    </span>
                                    </Menu.Item>
                                }

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

const ModelContext =(data)=>{
    return(
        <div>
            <Row>
                <h1 style={{textAlign:'center',marginBottom:'10px'}}>{data.title}</h1>

                <div style={{marginBottom:'10px'}} dangerouslySetInnerHTML={{  __html: htmlDecode(data.content) }}></div>

                <p style={{textAlign:'right',marginBottom:'10px',color:'#999'}}>{data.announcementDate}</p>
                <p style={{textAlign:'right',marginBottom:'10px'}}>
                    ——喜盈佳产品团队
                </p>
            </Row>

        </div>
    )
}



