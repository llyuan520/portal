/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 14:12
 * description  :
 */
import React,{Component} from 'react';
import { Spin,Icon,Card,Row,Col,Button,Modal,Select} from 'antd';
import {request,fMoney} from '../../../utils'
import ReactPiwik from '../../../piwik';

const Option = Select.Option;


class CompanyInformation extends Component{
    constructor(props) {
        super(props)
        this.state = {

            companyId: props.companyId,
            userId: 'admin',

            companyList:[],
            companyCode:'',
            companyName:'',
            selectCompanyCode:'',
            selectCompanyName:'',

            companyListKey: Date.now(),
            companyLoading: false,
            companyVisible: false,
            companyListLoaded:false,

            data : [
                {
                    icon:'file',
                    title:'协同开票服务',
                    productName:'',
                    bgcolor:'#3ea5ff',
                    tage:'待开票',
                    btn:'去开票',
                    unit:'',
                    anchorHref:'#cooperativebillin',
                    apiUrl:'/indexMessageOutline/queryDelayMakeInvoiceCount/',
                    refLoading:false,
                },{
                    icon:'file',
                    title:'融资服务',
                    productName:fMoney('123456789'),
                    bgcolor:'#00a136',
                    tage:'可融资金额',
                    btn:'去融资',
                    unit:'',
                    anchorHref:'#',
                    apiUrl:'',
                    refLoading:false,
                },{
                    icon:'file',
                    title:'税务服务',
                    productName:'国税申报、涉税查询',
                    bgcolor:'#6854a3',
                    tage:'',
                    btn:'去咨询',
                    unit:'',
                    anchorHref:'#',
                    apiUrl:'',
                    refLoading:false,
                },{
                    icon:'file',
                    title:'最新招标服务',
                    productName:'12',
                    bgcolor:'#ff9932',
                    tage:'与您最匹配的招标信息',
                    btn:'去招标',
                    unit:'',
                    anchorHref:'#biddingInformation',
                    apiUrl:'',
                    refLoading:false,
                },{
                    icon:'file',
                    title:'开票产品服务',
                    productName: '协同直连400元/月',
                    bgcolor:'#428fb9',
                    tage:'当前使用产品',
                    btn:'去续费',
                    unit:'',
                    anchorHref:'#',
                    apiUrl:'/indexMessageOutline/queryTOpsOrder/',
                    refLoading:false,
                }
            ]
        }
    }

    static defaultProps = {
        //companyId : '049d332afcae4fcc91de49c6bf94f267',
    }

    showModal = () => {
        this.setState({
            companyVisible: true,
        });
    }

    handleOk = () => {
        this.setState({ companyLoading: true });

        this.setState({
            companyLoading: false,
            companyVisible: false,
        },()=>{
            this.mounted && this.setState({
                companyCode: this.state.selectCompanyCode,
                companyName: this.state.selectCompanyName,
            })

            this.props.changeCompanyId(this.state.selectCompanyCode);
        });

        //切换公司之后调用

        this.getAllFetch(this.state.selectCompanyName);

        //TODO: 添加piwik点击事件跟踪
        ReactPiwik.push(['trackEvent', '供应商公司列表', '按钮点击事件']);
    }

    handleCancel = () => {
        this.setState({
            companyVisible: false,
            companyListKey: Date.now()+1,
        });
    }

    handleChange = value =>{
        this.setState({
            selectCompanyCode: value.key,
            selectCompanyName: value.label
        })
    }

    //根据companyName 获取所有信息
    getAllFetch = companyCode =>{
        const cartDate = this.state.data;
        for(let i=0; i<cartDate.length; i++){
            if(cartDate[i].apiUrl !== ''){

                cartDate[i].refLoading = true;
                this.mounted && this.setState({  data: cartDate });

                request.get(`${cartDate[i].apiUrl}${companyCode}`, {
                }).then(({data}) => {

                    if (data.code === 200) {
                        if(typeof(data.data) === 'string'){
                            cartDate[i].productName = data.data;
                            cartDate[i].refLoading = false;
                        }else{
                            console.log(data);
                            cartDate[i].productName = data.data.productName;
                            switch(i)
                            {
                                case 1:
                                    cartDate[i].unit = `${data.data.daysRemaining}(元)`;
                                    break;
                                case 3:
                                    cartDate[i].unit = `${data.data.daysRemaining} (条)`;
                                    break;
                                case 4:
                                    cartDate[i].unit = `(可用${data.data.daysRemaining}天)`;
                                    break;
                                default:
                                    cartDate[i].unit = data.data.daysRemaining;
                            }
                            cartDate[i].refLoading = false;
                        }
                        this.mounted && this.setState({  data: cartDate });
                    }

                });
            }
        }

    }

    //获取供应商公司列表信息
    getCompanyListFetch = (userId)=>{
        request.get(`/indexMessageOutline/queryCompanyList/${userId}`)
            .then((res)=>{
                if(res.data.code ===200){

                    this.mounted && this.setState({
                        companyList:res.data.data,
                        companyListLoaded: true,
                    },()=>{
                        this.mounted && this.setState({
                            companyCode: this.state.companyList[0].companyCode,
                            companyName: this.state.companyList[0].companyName,
                        },()=>{
                            this.getAllFetch(this.state.companyCode);
                        })
                    })

                }
            })
            .catch(err=>{
                this.mounted && this.setState({
                    companyListLoaded:true
                })
            })
    }

    renderCompanyIdSelector(){

        const options = this.state.companyList.map(item => <Option key={item.companyCode} >{item.companyName}</Option>);
        return(
            <Spin size='small' spinning={!this.state.companyListLoaded} key={this.state.companyListKey}>
                <Select
                    showSearch
                    labelInValue={true}
                    defaultValue={{ key: this.state.companyCode,label: this.state.companyName }}
                    style={{ width: '100%' }}
                    placeholder="请选择公司名称"
                    optionFilterProp="children"
                    notFoundContent="无法找到"
                    searchPlaceholder="输入关键词"
                    onChange={this.handleChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {options}
                </Select>
            </Spin>
        )
    }

    componentDidMount() {

        //this.state.companyId &&
        this.getCompanyListFetch(this.state.userId);

    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    handleClickAnchor=(href)=>{

        const targetElement = document.getElementById(href.substring(1));
        if (!targetElement) {
            return;
        }
        let eleOffsetTop = targetElement.offsetTop;
        this.goto(eleOffsetTop);

        window.history.pushState(null, '', href);

    }

    goto=(target)=>{
        const scrollT = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollT > target) {
            let timer = setInterval(function(){
                let scrollT = document.body.scrollTop|| document.documentElement.scrollTop
                let step = Math.floor(-scrollT/6);
                document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
                if(scrollT <= target){
                    document.body.scrollTop = document.documentElement.scrollTop = target;
                    clearTimeout(timer);
                }
            },20)
        }else if(scrollT === 0){
            let timer = setInterval(function(){
                let scrollT = document.body.scrollTop|| document.documentElement.scrollTop
                let step = Math.floor(300/3*0.7);
                document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
                if(scrollT >= target){
                    document.body.scrollTop = document.documentElement.scrollTop = target;
                    clearTimeout(timer);
                }
            },20)
        }else if(scrollT < target){
            let timer = setInterval(function(){
                let scrollT = document.body.scrollTop|| document.documentElement.scrollTop
                let step = Math.floor(scrollT/6);
                document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
                if(scrollT >= target){
                    document.body.scrollTop = document.documentElement.scrollTop = target;
                    clearTimeout(timer);
                }
            },20)
        }else if(target === scrollT){
            return false;
        }
    }

    render(){

        const { companyLoading, companyVisible } = this.state;

        return(
                <div className="p-main">
                    <div className="mediaWidth" style={{  padding: '40px 0 12px 0' }}>
                        <h1 style={{marginBottom:20,color: '#08c'}}>
                            <Icon type="apple-o" style={{marginRight:10 }} />
                            {this.state.companyName}
                            <span style={{ fontWeight: 'normal',color: '#333',cursor: 'pointer'}} onClick={this.showModal}>
                                 【切换<Icon type="caret-down" style={{ fontSize: 12,marginTop: 5,verticalAlign: 'text-top'}} />】
                             </span>
                        </h1>
                        <div className="p-product-main">

                            <Row gutter={16}>
                                {
                                    this.state.data.map((item,i)=>(
                                        <Col span={6} key={i} style={{width:'auto'}}>
                                            <Card key={i} loading={item.refLoading} noHovering className="p-product" bordered={false} style={{background:item.bgcolor}}>
                                                <h2>
                                                    <Icon type={item.icon} style={{ fontSize: 24, color: '#fff' }} />
                                                    <b>{item.title}</b>
                                                </h2>
                                                <h3>
                                                    <b>
                                                        {
                                                            item.productName
                                                        }
                                                    </b>
                                                    {item.unit}
                                                </h3>
                                                <p style={{ height: '28px', lineHeight: '28px'}}>
                                                    <span>{item.tage}</span>
                                                    <a
                                                        className="p-this-btn"
                                                        //href={item.anchorHref}
                                                        onClick={(href)=>this.handleClickAnchor(item.anchorHref)}
                                                    >
                                                        <Button ghost style={{ float: 'right',    borderRadius:'50px'}}>{item.btn}</Button>
                                                    </a>
                                                </p>
                                            </Card>
                                        </Col>
                                    ))
                                }
                            </Row>
                        </div>

                        <Modal
                            visible={companyVisible}
                            title="请选择公司名称"
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                                <Button key="submit" type="primary" size="large" loading={companyLoading} onClick={this.handleOk}>
                                    确定
                                </Button>,
                            ]}
                        >

                            <Row style={{width: '80%', margin: '0 auto'}}>
                                <Col span={5} style={{lineHeight: '28px'}}>
                                    公司名称：
                                </Col>
                                <Col span={19}>
                                    {
                                        this.renderCompanyIdSelector()
                                    }
                                </Col>
                            </Row>

                        </Modal>
                    </div>
                </div>
        )
    }
}

export default CompanyInformation



