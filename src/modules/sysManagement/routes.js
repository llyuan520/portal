/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 16:17
 * description  :
 */
import CompanyInfo from './companyInfo'
import CompanySort from './companySort'
const pathSys = '/sysManagement';

const routes = [
                {
                    name: '分类基础资料维护',
                    icon: 'user',
                    subKey:'companyInfo',
                    subNav: [{
                                path: `${pathSys}/companyInfo`,
                                component: CompanyInfo,
                                name: '公司信息',
                                exact: true,
                            },{
                                path: `${pathSys}/companySort`,
                                component: CompanySort,
                                name: '公司分类',
                                exact: true,
                            }, {
                                path: '/sysManagement',
                                redirect: true,
                                to: `${pathSys}/companyInfo`,
                            }]
                }
            ]

export default routes
