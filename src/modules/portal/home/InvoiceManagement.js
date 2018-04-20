/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 10:56
 * description  :
 */
import React,{Component} from 'react';
import { Card,Spin,Row,Col,Button} from 'antd';
import {request,piwik} from 'utils'

import icon01 from './img/icon-01.png'
import icon02 from './img/icon-02.png'
import icon03 from './img/icon-03.png'

class InvoiceManagement extends Component{

    constructor(props){
        super(props)
        this.state= {
            data:[
                {
                    title:'销项结算单',
                    context:'以结算单为基础和客户协作，开具符合双方标准的增值税发票',
                    imgUrl:icon01,
                },{
                    title:'销项发票',
                    context:'管理已开具的增值税发票',
                    imgUrl:icon02,
                },{
                    title:'进项结算单',
                    context:'以结算单为依据符合标准的增值税发票，指导供应商开具',
                    imgUrl:icon03,
                },{
                    title:'进项发票',
                    context:'管理已收到的增值税发票',
                    imgUrl:icon02,
                }
            ],
            jumpUrl:'',

            companyCode: props.companyCode,
            refLoading: false,
        }

    }

    fetch = () => {

        this.mounted && this.setState({ refLoading: true });
        request.get(`/link/queryPath`, {

        }).then(({data}) => {
            if (data.code === 200) {

                this.mounted && this.setState({
                    jumpUrl:data.data.homePath, //发票管理
                    refLoading: false,
                })

            }

        });
    }

    handleClickAnchor= url => e =>{
        //TODO: 添加piwik点击事件跟踪
        piwik.push(['trackEvent', '发票管理', '按钮点击事件']);

        window.open(url);
    }

    componentDidMount() {

        this.fetch();

    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.companyCode !== this.state.companyCode){
            this.fetch();
        }
    }

    render(){
        return(
            <Spin size='small' spinning={this.state.refLoading}>
               <div className="p-invoice-main">

                   <Row gutter={16}>
                       {
                           this.state.data.map((item,i)=>(
                               <Col span={6} key={i} >
                                   <Card noHovering  bordered={true} className="p-invoice-list">
                                       <Row>
                                           <Col span={6}>
                                               <img src={item.imgUrl} alt={item.title} />

                                           </Col>
                                           <Col span={18}>
                                               <h2>{item.title}</h2>
                                               <p>{item.context}</p>
                                           </Col>
                                       </Row>
                                   </Card>
                               </Col>
                           ))
                       }
                   </Row>
                   <Row style={{ marginTop: '40px' }}>
                       <Col span={24} style={{ textAlign: 'center' }}>
                           <a //href={this.state.jumpUrl}
                              target="_blank"
                              onClick={this.handleClickAnchor(this.state.jumpUrl)}
                           >
                               <Button type="primary" className="p-link-btn">点击进入</Button>
                           </a>

                       </Col>
                   </Row>
                </div>
            </Spin>
        )
    }

}

export default InvoiceManagement