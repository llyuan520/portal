/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 16:17
 * description  :
 */
import CompanyInfoSearch from './companyInfo'
import CompanySortSearch from './companyClass'
import UserManagement from './userManagement'

const pathSys = '/sysManagement';
const routes = [
    {
            path: `${pathSys}/companyInfo`,
            component: CompanyInfoSearch,
            name: '公司信息',
            exact: true,
        },{
            path: `${pathSys}/companyClass`,
            component: CompanySortSearch,
            name: '公司分类',
            exact: true,
        },{
            path: `${pathSys}/userManagement`,
            component: UserManagement,
            name: '用户管理',
            exact: true,
        },{
            path: `${pathSys}`,
            redirect: true,
            to: `${pathSys}/companyInfo`,
        }
]

export default routes
