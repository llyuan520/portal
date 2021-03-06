/**
 * author       : liuliyuan
 * createTime   : 2017/9/21 15:32
 * description  :
 */
import React from 'react';
import {Link} from 'react-router-dom'
import { Breadcrumb} from 'antd';

const removeParam = str =>{
    let pathArr = str.split(':');
    let prevPath = pathArr[0];
    return pathArr.length > 1 ? prevPath.substring(0,prevPath.length-1) : prevPath.substring(0,prevPath.length);
}

const PortalBreadCrumb = props =>  {

    const { location } = props;
    const pathSnippets = location.pathname.split('/').filter(i => i);

    const breadcrumbNameMap = {};
    props.routes.forEach(item=>{
        if(!item.to){
            //要去掉url的:参数
            breadcrumbNameMap[removeParam(item.path)] = item.name
        }
    })

    breadcrumbNameMap['/sysManagement']='首页';

    if(pathSnippets[1]==='home'){
        //如果是首页就踢出掉home，防止出现两个首页面包屑
        pathSnippets.pop()
    }

    //剔除掉路由表中没有的项
    let newPathSnippets = pathSnippets.map((item,index)=>{
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return breadcrumbNameMap[url] ? item : false;
    }).filter(i=>i)



    const extraBreadcrumbItems = newPathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        //const name = props.routes.filter(item => item.path===url)[0].name;
        return <Breadcrumb.Item key={url}>
            {
                //这条判断是为了在当前位置的时候禁止再点击当前位置的面包屑
                index ===  (newPathSnippets.length -1) ? <span>{breadcrumbNameMap[url]}</span>  : <Link to={url}>
                    {breadcrumbNameMap[url]}
                </Link>
            }
        </Breadcrumb.Item>
    });


    const breadcrumbItems = [].concat(extraBreadcrumbItems);

    return(
        <Breadcrumb style={{ margin: '12px 0' }}>
            {breadcrumbItems}
        </Breadcrumb>
    )
}

export default PortalBreadCrumb