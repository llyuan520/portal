/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 16:17
 * description  :
 */
import React,{Component} from 'react'
import { withRouter,Route,Redirect,Switch } from 'react-router-dom';
import LoadAble from 'react-loadable'
import {RouteWithSubRoutes,LoadingPage} from './components'
import {Layout,Button,Row,Col} from 'antd'
import Login from './modules/login'
import DashBoard from './modules/dashBoard';
import Sys from './modules/sys'
import {wrapPage} from './utils'

import Img404 from './components/loadingPage/img/404.png'


const AsyncLogin  = LoadAble({
    loader:()=> import('./modules/login'),
    loading:LoadingPage
})

const AsyncHome  = LoadAble({
    loader:()=> import('./modules/dashBoard'),
    loading:LoadingPage
})

const AsyncSys =  LoadAble({
    loader:()=> import('./modules/sys'),
    loading:LoadingPage
})

class PageNotFoundComponent extends Component{

    state={
        i:5,
    }

    componentDidMount() {
        this.interval = setInterval(()=>{
            let i = this.state.i;
            i -= 1;
            if (i < 1) {
                //i = 5;
                this.props.history.push('/dashboard');
            }
            this.mounted && this.setState({
                i: i
            });
        }, 1000)
    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
        this.interval && clearInterval(this.interval);
    }


    render(){
        return(
            <div style={{background:'#fff'}}>
                <Row gutter={48}>
                    <Col span={10} style={{textAlign:'right',marginTop:'130px'}}>
                        <img src={Img404} alt="页面找不到" />
                    </Col>
                    <Col span={14} style={{textAlign:'left',marginTop:'160px',lineHeight:'40px'}}>
                        <h1>sorry 您访问的页面丢失了</h1>
                        <p>
                            提示： 您可能输错了网址，或该网页已经删除或不存在，系统将在<span style={{color:'#FE5A37',fontSize:'18px',fontWeight:'bold'}}> {this.state.i} </span>秒后自动返回首页
                        </p>
                        <Button type="primary" icon="reload" onClick={()=>this.props.history.push('/dashboard')} style={{fontSize:'15px',height:'36px',marginTop:'40px'}}>返回首页</Button>
                    </Col>
                </Row>
            </div>
        )
    }

}

//路由配置文件
const routes = [
    {
        path:'/login',
        component:wrapPage('登录',AsyncLogin),
        name:'登录'
    },{
        path:'/dashboard',
        component:wrapPage('喜盈佳门户',AsyncHome),
        name:'首页'
    },{
        path: '/sys',
        component: AsyncSys,
        name: '后台管理',
    },{
        path: '*',
        component: withRouter(PageNotFoundComponent)
    }
];


const MainRoutes = () => (

    <Route render={({location})=>{

        const homeRoute = () => (
            <Redirect to="/login" />
        );
        return(
            <Layout>
                <Route exact strict path="/" render={homeRoute} />
                <Switch>
                    {routes.map((route, index) => (

                        <RouteWithSubRoutes key={index} {...route}/>
                    ))}
                </Switch>

            </Layout>
        )
    }} />

)
export default MainRoutes





