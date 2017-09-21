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
            dataX:[
                {
                    title:'',
                    imgUrl:logoImg,
                },{
                    title:'',
                    imgUrl:logoImg,
                },{
                    title:'',
                    imgUrl:logoImg,
                },{
                    title:'',
                    imgUrl:logoImg,
                },{
                    title:'',
                    imgUrl:logoImg,
                },{
                    title:'',
                    imgUrl:logoImg,
                },{
                    title:'',
                    imgUrl:logoImg,
                },{
                    title:'',
                    imgUrl:logoImg,
                }
            ],
            xyjJumpUrl:'',
            dataP:[
                {
                    title:'',
                    imgUrl:logoImg,
                },{
                    title:'',
                    imgUrl:logoImg,
                },{
                    title:'',
                    imgUrl:logoImg,
                }
            ],

            pytJumpUrl:'',
            companyId: props.companyId,
            refLoading: false,
        }

    }

    fetch = () => {

        this.mounted && this.setState({ refLoading: true });
        request.get(`/link/queryPath`, {

        }).then(({data}) => {
            console.log(data);


            /*this.state.setState({
                pytJumpUrl: data.data.homePath
            })*/

           /* const homePath =   `${data.homePath}&redirect&settlement`, //票易通协同开票地址
                  homePath2 =   data.homePat`  //发票管理*/


            if (data.code === 200) {
                this.mounted && this.setState({
                    pytJumpUrl: `${data.data.homePath}&redirect&settlement`, //票易通协同开票地址
                    refLoading: false,
                });
            }

        });
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
                    <Col span={12} className="p-billing-list">
                        <h3>给<span className="c108ee9">万科、保利地产</span>开票入口</h3>
                        <Card noHovering className="p-billing-itme">
                            <Row gutter={24} className="p-billing-img">
                                {
                                    this.state.dataX.map((item,i)=>(
                                        <Col key={i} span={6}>
                                            <img alt={item.title} src={item.imgUrl} />
                                        </Col>
                                    ))
                                }
                            </Row>
                            <Row style={{ marginTop: '40px' }}>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <a href={this.state.xyjJumpUrl} target="_blank">
                                        <Button type="primary" className="p-link-btn">协同开票</Button>
                                    </a>

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
                                {
                                    this.state.dataP.map((item,i)=>(
                                        <Col key={i} span={6}>
                                            <img alt={item.title} src={item.imgUrl} />
                                        </Col>
                                    ))
                                }
                            </Row>
                            <Row style={{ marginTop: '40px' }}>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                     <a href={this.state.pytJumpUrl} target="_blank">
                                        <Button type="primary" className="p-link-btn">协同开票</Button>
                                    </a>
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