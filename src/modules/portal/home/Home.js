/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 17:43
 * description  :
 */
import React,{Component} from 'react';
import { Layout} from 'antd';
import CompanyInformation from './CompanyInformation'
import BiddingInformation from './BiddingInformation'
import InvoiceManagement from './InvoiceManagement'
import Cooperativebillin from './Cooperativebillin'

import './style.less';


const titleArry =[
    {
        title:'协同开票',
        color:'#3ea5ff',
        component:Cooperativebillin,
        anchorId:'cooperativebillin',
    },{
        title:'发票管理',
        color:'#3ea5ff',
        component:InvoiceManagement,
        anchorId:'invoiceManagement',
    },{
        title:'招标信息',
        color:'#ff9932',
        component:BiddingInformation,
        anchorId:'biddingInformation',
    }
]

/*const titleArry =[
    {
        title:'协同开票',
        color:'#3ea5ff',
    },{
        title:'发票管理',
        color:'#3ea5ff',
    },{
         title:'供应链金融服务',
         color:'#00a136',
    },{
        title:'招标信息',
        color:'#ff9932',
    },{
        title:'税务服务',
        color:'#6854a3',
    },{
        title:'开票产品',
        color:'#3ea5ff',
    }
]*/


class Home extends Component{

    constructor(props){
        super(props)
        this.state= {
            companyCode: '',
        }

        this.changeCompanyCode = this.changeCompanyCode.bind(this);
    }

    //给其它组件传数据
    changeCompanyCode=companyCode=>{
        this.mounted && this.setState({
            companyCode
        })
    }

    //用来处理组件 被 setState(...): 调用的时候 组件已经被销毁导致调用不存在
    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

     render(){

         return(
             <Layout>

                 {/*公司信息切换*/}
                 <CompanyInformation  changeCompanyCode={this.changeCompanyCode} />

                 {
                     this.state.companyCode && titleArry.map((item, i)=>(

                         <div key={i} id={item.anchorId} className="p-main" style={{ background: i%2 !== 0  ? '#ececec' : '#fff' }}>
                             <div className="mediaWidth" style={{  padding: '40px 0' }}>
                                 <h1 className="p-context-title" style={{color:item.color,borderLeft: `5px solid ${item.color}` }}> {item.title}
                                     {
                                         item.title.indexOf('招标信息') !== -1 &&  <span style={{color:'#ddd',fontSize:12}}>
                                                     （推荐来自<span className="c108ee9">万科、保利地产、深圳地铁集团</span>等最新招标信息）
                                                 </span>
                                     }
                                 </h1>

                                 {
                                     <item.component companyCode={this.state.companyCode} />
                                 }

                             </div>
                         </div>
                     ))
                 }



             </Layout>
         )
     }
 }

 export default Home





