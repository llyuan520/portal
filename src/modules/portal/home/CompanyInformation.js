/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 14:12
 * description  :
 */
import React,{Component} from 'react';
import { Spin,Icon,Card,Row,Col,Button,Modal,Select} from 'antd';
import {request,fMoney} from '../../../utils'

const Option = Select.Option;

const data =[
    {
        icon:'file',
        title:'协同开票服务',
        context:'24',
        bgcolor:'#3ea5ff',
        tage:'待开票',
        btn:'去开票',
        unit:'',
        anchorHref:'#cooperativebillin',
    },{
        icon:'file',
        title:'融资服务',
        context:fMoney('123456789'),
        bgcolor:'#00a136',
        tage:'可融资金额',
        btn:'去融资',
        unit:'(元)',
        anchorHref:'#',
    },{
        icon:'file',
        title:'税务服务',
        context:'国税申报、涉税查询',
        bgcolor:'#6854a3',
        tage:'',
        btn:'去咨询',
        unit:'(条)',
        anchorHref:'#',
    },{
        icon:'file',
        title:'最新招标服务',
        context:'12',
        bgcolor:'#ff9932',
        tage:'与您最匹配的招标信息',
        btn:'去招标',
        unit:'',
        anchorHref:'#biddingInformation',
    },{
        icon:'file',
        title:'开票产品服务',
        context: '协同直连400元/月',
        bgcolor:'#428fb9',
        tage:'当前使用产品',
        btn:'去续费',
        unit:'(可用30天)',
        anchorHref:'#',
    }
]

const projectCompany=[
    {
        companyId:'397',
        companyName:'17爆款哑光磨砂果冻包'
    },{
        companyId:'143598',
        companyName:'150cm小个子女装'
    },{
        companyId:'1904',
        companyName:'17年爆款雪纺长裙'
    },{
        companyId:'19852',
        companyName:'145cm女装'
    },{
        companyId:'447725',
        companyName:'10元以下包邮 天天特价'
    },{
        companyId:'880',
        companyName:'1岁宝宝秋装男'
    }
]



class CompanyInformation extends Component{
    constructor(props) {
        super(props)
        this.state = {
            companyId: props.companyId,
            projectCompany:[],
            refLoading: false,
            companyLoading: false,
            companyVisible: false,
            coreCompanyLoaded:false,
        }
    }

    showModal = () => {
        this.setState({
            companyVisible: true,
        });
    }

    handleOk = () => {
        this.setState({ companyLoading: true });
        //setTimeout(() => {
            this.setState({
                companyLoading: false,
                companyVisible: false,
            },()=>{
                this.props.changeCompanyId(this.state.companyId);
            });
            console.log(this.state.companyId);

        //}, 3000);
        this.fetch(this.state.companyId);
    }

    handleCancel = () => {
        this.setState({
            companyVisible: false
        });
    }

    handleChange = value =>{
        this.setState({
            companyId: value
        })
    }

    renderCompanyIdSelector(){

        const options = projectCompany.map(item => <Option  key={item.companyId} >{item.companyName}</Option>);
        return(
            <Spin size='small' spinning={!this.state.coreCompanyLoaded}>
                <Select
                    showSearch
                    defaultValue={this.state.companyId}
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
                console.log(scrollT)
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


    fetch = companyId => {

        this.mounted && this.setState({ refLoading: true });
        request.get(`/get/${companyId}`, {

        }).then(({data}) => {

            //setTimeout(() => {
                this.mounted && this.setState({
                    refLoading: false,
                });
            //}, 3000);

            /*if (data.code === 200) {
                this.mounted && this.setState({
                    companyInfoData: {...data.data},
                    refLoading: false,
                });
            }*/

        });
    }

    getCompanyIdFetch = ()=>{
        request.get('/core_enterprises')
            .then(res=>{

                setTimeout(() => {
                    this.mounted && this.setState({
                        coreCompanyLoaded:true,
                        projectCompany: projectCompany,
                    })
                }, 5000);

                /*if(res.data.code ===200){

                    this.mounted && this.setState({
                        coreCompany:res.data.data
                    })

                }*/
            })
            .catch(err=>{
                this.mounted && this.setState({
                    coreCompanyLoaded:true
                })
            })
    }

    componentDidMount() {

        this.fetch(this.state.companyId);
        this.state.companyId && this.getCompanyIdFetch();

    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    render(){

        const { companyLoading, companyVisible } = this.state;

        return(
            <Spin size='small' spinning={this.state.refLoading}>
                <div className="p-main">
                    <div className="mediaWidth" style={{  padding: '40px 0' }}>
                        <h1 style={{marginBottom:20,color: '#08c'}}>
                            <Icon type="apple-o" style={{marginRight:10 }} />
                            日立电梯（中国）有限公司
                            <span style={{ fontWeight: 'normal',color: '#333',cursor: 'pointer'}} onClick={this.showModal}>
                                 【切换<Icon type="caret-down" style={{ fontSize: 12,marginTop: 5,verticalAlign: 'text-top'}} />】
                             </span>
                        </h1>
                        <div className="p-product-main">

                            {
                                data.map((item,i)=>{
                                    return(
                                        <Card key={i}  noHovering className="p-product" bordered={false} style={{background:item.bgcolor}}>
                                            <h2>
                                                <Icon type={item.icon} style={{ fontSize: 24, color: '#fff' }} />
                                                <b>{item.title}</b>
                                            </h2>
                                            <h3>
                                                <b>
                                                    {
                                                        item.context
                                                    }
                                                </b>
                                                {item.unit}
                                            </h3>
                                            <p style={{ height: '28px', lineHeight: '28px'}}>
                                                <span>{item.tage}</span>
                                                <a
                                                    //href={item.anchorHref}
                                                    onClick={(href)=>this.handleClickAnchor(item.anchorHref)}
                                                >
                                                    <Button ghost style={{ float: 'right'}}>{item.btn}</Button>
                                                </a>
                                            </p>
                                        </Card>
                                    )
                                })
                            }
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

            </Spin>
        )
    }
}

export default CompanyInformation



