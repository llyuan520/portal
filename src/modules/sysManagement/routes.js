/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 16:17
 * description  :
 */
import CompanyInfoSearch from './companyInfo'
import CompanySortSearch from './companyClass'
const pathSys = '/sysManagement';
const routes = [
                {
                    name: '分类基础资料维护',
                    icon: 'user',
                    subKey:'companyInfo',
                    subNav: [{
                                path: `${pathSys}/companyInfo`,
                                component: CompanyInfoSearch,
                                name: '公司信息',
                                //exact: true,
                            },{
                                path: `${pathSys}/companyClass`,
                                component: CompanySortSearch,
                                name: '公司分类',
                                //exact: true,
                            },{
                                path: `${pathSys}`,
                                redirect: true,
                                to: `${pathSys}/companyInfo`,
                            }]
                }
            ]

export default routes
