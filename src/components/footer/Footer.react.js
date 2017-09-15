/**
 * author       : liuliyuan
 * createTime   : 2017/9/6 17:53
 * description  :
 */

import React,{ Component } from 'react';
import { Layout,Row,Col,Icon  } from 'antd';
import {copyRight,linkList} from "../../config/index";
import './style.less';

const { Footer } = Layout;


class Footers extends Component{
    render(){
        return(
            <Layout className="p-footer-bg">
                <div style={{borderBottom: '1px solid #ccc'}}>
                    <Footer className="p-footer" style={{textAlign: 'center'}}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box p-border">
                                    <div>
                                        <Icon type="customer-service" className="p-iconSize" />
                                        <p>贴心</p>
                                    </div>
                                    <p>7X24小时客服热线</p>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box p-border">
                                    <div>
                                        <Icon type="safety" className="p-iconSize" />
                                        <p>安全</p>
                                    </div>
                                    <p>多维度数据加密机制</p>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box p-border">
                                    <div>
                                        <Icon type="global" className="p-iconSize" />
                                        <p>稳定</p>
                                    </div>
                                    <p>网站可用性高于99.9%</p>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box">
                                    <div>
                                        <Icon type="api" className="p-iconSize" />
                                        <p>实力</p>
                                    </div>
                                    <p>服务于500强地产中心客户</p>
                                </div>
                            </Col>
                        </Row>
                    </Footer>
                </div>

                <Footer className="p-footer" style={{textAlign: 'left'}}>

                    <div className="p-link">
                        友情链接：{
                                        linkList.map((item,i)=>{
                                            return <a key={i} href={item.url} target="_blank">{item.name}</a>
                                        })
                                    }

                    </div>
                    <div style={{textAlign: 'center',marginTop:'30px'}}> {copyRight} </div>
                </Footer>
            </Layout>
        )
    }
}

export default Footers;