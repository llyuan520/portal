/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 11:01
 * description  :
 */
import React,{Component} from 'react';
import { Spin,Card,Row,Col,Button} from 'antd';
import {request} from '../../../utils'
import ReactPiwik from '../../../piwik';
import {configData} from '../../../config';

import logo013 from './img/media/logo-013.png';
import logo01 from './img/media/logo-01.png';
import logo05 from './img/media/logo-05.png';
import logo010 from './img/media/logo-010.png';
import logo09 from './img/media/logo-09.png';
import logo011 from './img/media/logo-011.png';


class Cooperativebillin extends Component{

    constructor(props){
        super(props)
        this.state= {
            dataX:[
                {
                    title:'万科',
                    imgUrl:logo013,
                },{
                    title:'中国保利集团',
                    imgUrl:logo01,
                }
            ],
            xyjJumpUrl:`${configData.address}wims/yiw0000.page?home`,
            dataP:[
                {
                    title:'应力',
                    imgUrl:logo05,
                },{
                    title:'深圳地铁',
                    imgUrl:logo010,
                },{
                    title:'宝龙地产',
                    imgUrl:logo09,
                },{
                    title:'世贸集团',
                    imgUrl:logo011,
                }
            ],

            pytJumpUrl:'',
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
                    pytJumpUrl: `${data.data.homePath}&redirect=settlement`, //票易通协同开票地址
                    refLoading: false,
                });
            }

        });
    }

    handleClick = url => e =>{
        //TODO: 添加piwik点击事件跟踪
        ReactPiwik.push(['trackEvent', '协同开票', '点击跳转到喜盈佳还是票易通3.0']);

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
                <Row gutter={40} className="p-billing">
                    <Col span={12} className="p-billing-list">
                        <h3>给<span className="c108ee9">万科、保利地产</span>开票入口</h3>
                        <Card noHovering className="p-billing-itme">
                            <Row gutter={24} className="p-billing-img">
                                {
                                    this.state.dataX.map((item,i)=>(
                                        <Col key={i} span={6}>
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
                    <Col span={12} className="p-billing-list">
                        <h3>
                            给<span className="c108ee9">印力、深圳地铁、宝龙、世茂</span>开票入口
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
                    </Col>
                </Row>
            </Spin>

        )
    }

}

export default Cooperativebillin