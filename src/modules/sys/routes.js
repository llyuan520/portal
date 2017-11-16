/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 16:17
 * description  :
 */
import CompanyInfo from './companyInfo'
import CompanyClass from './companyClass'
import UserManagement from './userManagement'
import BulletinManagement from './bulletinManagement'
import {wrapPage} from './../../utils'

const routes = [
    {
        path: '/sys/companyInfo',
        component: wrapPage('公司信息',CompanyInfo),
        name: '公司信息',
        exact: true,
    },{
         path: '/sys/companyClass',
         component: wrapPage('公司分类',CompanyClass),
         name: '公司分类',
         exact: true,
     },{
        path: '/sys/userManagement',
        component: wrapPage('用户管理',UserManagement),
        name: '用户管理',
        exact: true,
    },{
        path: '/sys/bulletinManagement',
        component: wrapPage('公告管理',BulletinManagement),
        name: '公告管理',
        exact: true,
    },{
        path: '/sys',
        redirect: true,
        to: '/sys/companyInfo',
    }
]

export default routes