/**
 * author       : liuliyuan
 * createTime   : 2017/11/15 10:09
 * description  :
 */
import React from 'react';
import {Spin} from 'antd'

export default ({isLoading, error}) => {
    // Handle the loading state
    if (isLoading) {
        return <Spin></Spin>;
    }
    // Handle the error state
    else if (error) {
        return <div>页面加载出错，请重试</div>;
    }
    else {
        return null;
    }
};