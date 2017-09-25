/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 16:17
 * description  :
 */
import {Home} from './home';

//路由配置文件
const routes = [
    {
        path: '/dashboard/home',
        component: Home,
        name: '门户首页'
    },{
        path:'/dashboard',
        redirect:true,
        to:'/dashboard/home'
    }
];

export default routes

