/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 11:01
 * description  :
 */
import React,{Component} from 'react';
import { Spin,Card,Row,Col,Button} from 'antd';
import {request} from '../../../utils'
import ReactPiwik from '../../../piwik';

import vanke from './img/media/vanke.png';
import bldc from './img/media/bldc.png';
import blzy from './img/media/blzy.png';
import jyjt from './img/media/jyjt.png';
import tcdc from './img/media/tcdc.png';

class Cooperativebillin extends Component{

    constructor(props){
        super(props)
        this.state= {
            dataX:[
                {
                    title:'万科',
                    imgUrl:vanke,
                },{
                    title:'保利地产',
                    imgUrl:bldc,
                },{
                    title:'保利置业',
                    imgUrl:blzy,
                },{
                    title:'建业集团',
                    imgUrl:jyjt,
                },{
                    title:'同创地产',
                    imgUrl:tcdc,
                }
            ],
            xyjJumpUrl:'http://t1.servingcloud.com/wims/yiw0000.page?home',
            dataP:[],

            pytJumpUrl:'',
            companyId: props.companyId,
            refLoading: false,
        }

    }

    fetch = () => {

        this.mounted && this.setState({ refLoading: true });
        request.get(`/link/queryPath`, {

        }).then(({data}) => {
            if (data.code === 200) {
                this.mounted && this.setState({
                    pytJumpUrl: `${data.data.homePath}&redirect=settlement`, //票易通协同开票地址
                    refLoading: false,
                });
            }

        });
    }

    handleClick = url => e =>{
        window.open(url);

        //TODO: 添加piwik点击事件跟踪
        ReactPiwik.push(['trackEvent', '协同开票', '点击跳转到喜盈佳还是票易通3.0']);
    }

    componentDidMount() {

       this.fetch();

    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.companyId !== this.state.companyId){
            this.fetch();
        }
    }

    render(){
        return(
            <Spin size='small' spinning={this.state.refLoading}>
                <Row gutter={40} className="p-billing">
                    <Col span={24} className="p-billing-list">
                        <h3>给<span className="c108ee9">万科、保利地产</span>开票入口</h3>
                        <Card noHovering className="p-billing-itme">
                            <Row gutter={24} className="p-billing-img">
                                {
                                    this.state.dataX.map((item,i)=>(
                                        <Col key={i} span={4}>
                                            <img alt={item.title} src={item.imgUrl} width="100%" />
                                        </Col>
                                    ))
                                }
                            </Row>
                            <Row style={{ marginTop: '40px' }}>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="primary" className="p-link-btn" onClick={this.handleClick(this.state.xyjJumpUrl)}>协同开票</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {/*<Col span={12} className="p-billing-list">
                        <h3>
                            给<span className="c108ee9">金地集团、印力集团</span>开票入口
                        </h3>
                        <Card noHovering className="p-billing-itme">
                            <Row gutter={24} className="p-billing-img">
                                {
                                    this.state.dataP.map((item,i)=>(
                                        <Col key={i} span={6}>
                                            <img alt={item.title} src={item.imgUrl} width="100%" />
                                        </Col>
                                    ))
                                }
                            </Row>
                            <Row style={{ marginTop: '40px' }}>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="primary" className="p-link-btn" onClick={this.handleClick(this.state.pytJumpUrl)}>协同开票</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>*/}
                </Row>
            </Spin>

        )
    }

}

export default Cooperativebillin