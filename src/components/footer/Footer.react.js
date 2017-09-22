/**
 * author       : liuliyuan
 * createTime   : 2017/9/6 17:53
 * description  :
 */

import React,{ Component } from 'react';
import { Layout,Row,Col,Icon} from 'antd';
import {withRouter} from 'react-router-dom';
import {copyRight,linkList} from "../../config/index";
import './style.less';

const { Footer } = Layout;

class Footers extends Component{
    render(){

        const { location } = this.props;
        let pathname = parseInt(location.pathname.indexOf('sysManagement'),0);

        return(

            pathname === 1 ? <AdminFooter /> : <UserFooter />

        )
    }
}

export default withRouter(Footers)

const UserFooter = ()=><Layout style={{background: '#40484E'}}>
    <div style={{borderBottom: '1px solid #ccc'}}>
        <div style={{textAlign: 'center',padding: '24px 50px',color:'#fff'}}>
            <div className="mediaWidth">
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
            </div>
        </div>
    </div>

    <div style={{textAlign: 'left',padding: '24px 50px',color:'#fff'}}>
        <div className="mediaWidth">
            <div className="p-link">
                友情链接：{
                linkList.map((item,i)=>{
                    return <a key={i} href={item.url} target="_blank">{item.name}</a>
                })
            }

            </div>
            <div style={{textAlign: 'center',marginTop:'30px'}}> {copyRight} </div>
        </div>
    </div>
</Layout>

const AdminFooter = ()=><Footer style={{ textAlign: 'center' }}>
    {copyRight}
</Footer>