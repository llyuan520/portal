/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 11:01
 * description  :
 */
import React,{Component} from 'react';
import { Spin,Card,Row,Col,Button} from 'antd';
import {request} from '../../../utils'

import logoImg from '../../../components/header/media/logo-02.png'

class Cooperativebillin extends Component{

    constructor(props){
        super(props)
        this.state= {
            companyId: props.companyId,
            refLoading: false,
        }

    }

    fetch = companyId => {

        this.mounted && this.setState({ refLoading: true });
        request.get(`/get/${companyId}`, {

        }).then(({data}) => {

            setTimeout(() => {
                this.mounted && this.setState({
                    refLoading: false,
                });
            }, 3000);

            /*if (data.code === 200) {
                this.mounted && this.setState({
                    companyInfoData: {...data.data},
                    refLoading: false,
                });
            }*/

        });
    }

    componentDidMount() {

       this.fetch(this.state.companyId);

    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.companyId !== this.state.companyId){
            this.fetch(nextProps.companyId);
        }
    }

    render(){
        return(
            <Spin size='small' spinning={this.state.refLoading}>
                <Row gutter={40} className="p-billing">
                    <Col span={12} className="p-billing-list">
                        <h3>给<span className="c108ee9">万科、保利地产</span>开票入口</h3>
                        <Card noHovering className="p-billing-itme">
                            <Row gutter={24} className="p-billing-img">
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '20px' }}>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="primary" className="p-link-btn">协同开票</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={12} className="p-billing-list">
                        <h3>
                            给<span className="c108ee9">金地集团、印力集团</span>开票入口
                        </h3>
                        <Card noHovering className="p-billing-itme">
                            <Row gutter={24} className="p-billing-img">
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                                <Col span={6}>
                                    <img alt="" src={logoImg} />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '20px' }}>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="primary" className="p-link-btn">协同开票</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Spin>

        )
    }

}

export default Cooperativebillin