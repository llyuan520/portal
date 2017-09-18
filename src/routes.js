/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 16:17
 * description  :
 */
import React from 'react'
import { Route,Redirect,Switch } from 'react-router-dom';
import {RouteWithSubRoutes} from './components'
import {Layout} from 'antd'
import {Home} from './modules/portal/home';
import {SysManagement} from './modules/sysManagement/home';

const PageNotFoundComponent =  ()=><div> 404 </div>;

//路由配置文件
const routes = [
    {
        path:'/home',
        component:Home,
        name:'门户首页'
    },{
        path:'/admin',
        component:SysManagement,
        name:'后台管理'
    },{
        path: '*',
        component: PageNotFoundComponent
    }
];

const MainRoutes = () => (

    <Route render={({location})=>{

        const homeRoute = () => (
            <Redirect to="/home"/>
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
