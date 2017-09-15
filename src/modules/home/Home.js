/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 17:43
 * description  :
 */
import React,{Component} from 'react';
import { Layout } from 'antd';

const data =[
    {
        title:'协同开票',
        color:'#108ee9',
    },{
        title:'发票管理',
        color:'#108ee9',
    },{
        title:'供应链金融服务',
        color:'#108ee9',
    },{
        title:'招标信息',
        color:'#108ee9',
    },{
        title:'税务服务',
        color:'#108ee9',
    },{
        title:'开票产品',
        color:'#108ee9',
    }
]


class Home extends Component{

    state = {
        data : data,
    }

     render(){
         return(
             <Layout>

                 <div style={{background:'#fff', padding: '0 50px', }}>
                     <div className="mediaWidth" style={{  minHeight: 280 }}>
                         供应链金融服务供应链金融服务供应链金融服务供应链金融服务
                     </div>
                 </div>

             </Layout>
         )
     }
 }

 export default Home