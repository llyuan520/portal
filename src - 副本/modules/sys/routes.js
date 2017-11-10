/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 16:17
 * description  :
 */
import CompanyInfo from './companyInfo'
import CompanyClass from './companyClass'
import UserManagement from './userManagement'
import BulletinManagement from './bulletinManagement'

const routes = [
    {
        path: '/sys/companyInfo',
        component: CompanyInfo,
        name: '公司信息',
        exact: true,
    },{
         path: '/sys/companyClass',
         component: CompanyClass,
         name: '公司分类',
         exact: true,
     },{
        path: '/sys/userManagement',
        component: UserManagement,
        name: '用户管理',
        exact: true,
    },{
        path: '/sys/bulletinManagement',
        component: BulletinManagement,
        name: '公告管理',
        exact: true,
    },{
        path: '/sys',
        redirect: true,
        to: '/sys/companyInfo',
    }
]

export default routes