/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 16:17
 * description  :
 */
import React from 'react'
import CompanyInfo from './companyInfo'
import CompanySort from './companySort'

const routes = [
    {
        path:'/admin/companyInfo',
        component:CompanyInfo,
        name:'公司信息',
        icon:'user',
        exact:true,
    },
    {
        path:'/admin/companySort',
        component:CompanySort,
        name:'公司分类',
        icon:'user',
        exact:true,
    }
]

export default routes
