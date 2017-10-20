/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 14:12
 * description  :
 */
import React,{Component} from 'react';
import { Spin,Icon,Card,Row,Col,Button,Modal,Select} from 'antd';
import {request,fMoney,piwik} from '../../../utils'
import oauth from '../../../oAuth';
import {configData} from '../../../../src/config/index'

const Option = Select.Option;


class CompanyInformation extends Component{
    constructor(props) {
        super(props)
        this.state = {

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
                    key:1,
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
                    key:4,
                    icon:'file',
                    title:'最新招标服务',
                    productName:'',
                    bgcolor:'#ff9932',
                    tage:'与您最匹配的招标信息',
                    btn:'去招标',
                    unit:'',
                    anchorHref:'#biddingInformation',
                    apiUrl:'/indexMessageOutline/queryValidBidsCount',
                    refLoading:false,
                },{
                    key:5,
                    icon:'file',
                    title:'开票产品服务',
                    productName: '',
                    bgcolor:'#428fb9',
                    tage:'当前使用产品',
                    btn:'去续费',
                    unit:'',
                    anchorHref:'#',
                    apiUrl:'/indexMessageOutline/queryTOpsOrder/',
                    refLoading:false,

                },{
                    key:2,
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
                    key:3,
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
                    key:6,
                    icon:'file',
                    title:'项目管理',
                    productName:'管理你的项目',
                    bgcolor:'#4BB1A6',
                    tage:'',
                    btn:'去管理',
                    unit:'',
                    anchorHref:'#',
                    apiUrl:'',
                    refLoading:false,
                }
            ]
        }
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
                companyCode: this.state.selectCompanyCode || this.state.companyCode,
                companyName: this.state.selectCompanyName || this.state.companyName,
            },()=>{
                //切换公司之后调用
                this.getAllFetch(this.state.companyCode);
                this.props.changeCompanyCode(this.state.companyCode);
            })
        });

        //TODO: 添加piwik点击事件跟踪
        piwik.push(['trackEvent', '供应商切换公司列表', '切换公司按钮点击事件']);
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

                let url = `${cartDate[i].apiUrl}`;
                    if(cartDate[i].key !== 4){
                        url+=`${companyCode}`;
                    }

                request.get(url, {
                }).then(({data}) => {

                    if (data.code === 200) {

                        cartDate[i].productName = data.data.productName;
                        switch(cartDate[i].key)
                        {
                            case 1:
                                cartDate[i].unit = `${data.data} (张)`;
                                break;
                            case 2:
                                cartDate[i].unit = `${data.data.daysRemaining} (元)`;
                                break;
                            case 4:
                                cartDate[i].unit = `${data.data} (条)`;
                                break;
                            case 5:
                                cartDate[i].unit = data.data.daysRemaining === null ? ` (可用0天)` :  ` (可用${data.data.daysRemaining}天)`;
                                break;
                            default:
                                cartDate[i].unit = data.data;
                        }
                        cartDate[i].refLoading = false;

                        this.mounted && this.setState({
                            data: cartDate
                        });
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
                            this.props.changeCompanyCode(this.state.companyCode);
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
        const name = oauth.getUser().sysXYJUserBO.name;
        this.getCompanyListFetch(name);
    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    handleClickAnchor= item => e =>{

        if(item.key === 6){
           window.location=configData.homeProjectUrl;
        }else{
            window.history.pushState(null, '', item.anchorHref);
            //TODO: 添加piwik点击事件跟踪
            piwik.push(['trackEvent', `${item.title}`, `${item.btn}`]);
        }
    }


    render(){

        const { companyLoading, companyVisible } = this.state;

        return(
                <div className="p-main" style={{background: '#ececec'}}>
                    <div className="mediaWidth" style={{  padding: '40px 0 12px 0' }}>
                        <h1 style={{marginBottom:20,color: '#08c'}}>
                            <Icon type="home" style={{marginRight:10 }} />
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
                                            <Card loading={item.refLoading} noHovering className="p-product" bordered={false} style={{background:item.bgcolor}}>
                                                <h2>
                                                    <Icon type={item.icon} style={{ fontSize: 24, color: '#fff' }} />
                                                    <b>{item.title}</b>
                                                </h2>
                                                <h3>
                                                    <b>
                                                        {
                                                            item.key !==2 && item.key !==3 ? item.productName : '敬请期待...'

                                                        }
                                                    </b>
                                                    {item.unit}
                                                </h3>
                                                <p style={{ height: '28px', lineHeight: '28px'}}>
                                                    <span>
                                                        {
                                                            item.key !==2 && item.tage
                                                        }
                                                    </span>
                                                    {
                                                        item.key !==2 && item.key !==3 && item.key !==5 &&   <a
                                                            className="p-this-btn"
                                                            href={item.anchorHref}
                                                            onClick={this.handleClickAnchor(item)}
                                                        >
                                                            <Button ghost style={{ float: 'right',    borderRadius:'50px'}}>{item.btn}</Button>
                                                        </a>
                                                    }

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



