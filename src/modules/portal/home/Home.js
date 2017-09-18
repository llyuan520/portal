/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 17:43
 * description  :
 */
import React,{Component} from 'react';
import { Layout,Icon,Card,Row,Col,Button,Modal,Select } from 'antd';
import {Link} from 'react-router-dom';
import {fMoney} from '../../../utils'
import logoImg from '../../../components/header/media/logo-02.png'
import xxfp from './img/xxfp.png'
import './style.less';


const Option = Select.Option;

const ColSpan = 6;
const data =[
    {
        icon:'file',
        title:'协同开票服务',
        context:'24',
        bgcolor:'#3ea5ff',
        tage:'待开票',
        btn:'去开票',
        unit:'',
    },{
        icon:'file',
        title:'融资服务',
        context:fMoney('123456789'),
        bgcolor:'#00a136',
        tage:'可融资金额',
        btn:'去融资',
        unit:'(元)',
    },{
        icon:'file',
        title:'税务服务',
        context:'国税申报、涉税查询',
        bgcolor:'#6854a3',
        tage:'',
        btn:'去咨询',
        unit:'(条)',
    },{
        icon:'file',
        title:'最新招标服务',
        context:'12',
        bgcolor:'#ff9932',
        tage:'与您最匹配的招标信息',
        btn:'去招标',
        unit:'',
    },{
        icon:'file',
        title:'开票产品服务',
        context: '协同直连400元/月',
        bgcolor:'#428fb9',
        tage:'当前使用产品',
        btn:'去续费',
        unit:'(可用30天)',
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


class Home extends Component{

    state = {

        companyId:'',
        companyLoading: false,
        companyVisible: false,
    }

    showModal = () => {
        this.setState({
            companyVisible: true,
        });
    }

    handleOk = () => {
        this.setState({ companyLoading: true });
        setTimeout(() => {
            this.setState({ companyLoading: false, companyVisible: false });
            console.log(this.state.companyId);
        }, 3000);
    }

    handleCancel = () => {
        this.setState({ companyVisible: false });
    }


    handleChange = value =>{
        this.setState({
            companyId: value
        })
    }




    renderCompanyIdSelector(){

        const options = projectCompany.map(item => <Option  key={item.companyId} >{item.companyName}</Option>);
        return(
                <Select
                    showSearch
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
        )
    }

     render(){

         const { companyLoading, companyVisible } = this.state;

         return(
             <Layout>

                 <div className="p-main">
                     <div className="mediaWidth" style={{  padding: '40px 0 10px 0' }}>
                         <h1 style={{marginBottom:20,color: '#08c'}}>
                             <Icon type="apple-o" style={{marginRight:10 }} />
                             日立电梯（中国）有限公司
                             <span style={{ fontWeight: 'normal',color: '#333',cursor: 'pointer'}} onClick={this.showModal}>
                                 【切换<Icon type="caret-down" style={{ fontSize: 12,marginTop: 5,verticalAlign: 'text-top'}} />】
                             </span>
                         </h1>
                         <div className="p-product-main">
                             <Row gutter={0}>
                                 {
                                     data.map((item,i)=>{
                                         return(
                                             <Col style={{marginBottom:20}} key={i} span={ColSpan}>
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
                                                         <Button ghost style={{ float: 'right'}}>{item.btn}</Button>
                                                     </p>
                                                 </Card>
                                             </Col>
                                         )
                                     })
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


                 <div className="p-main" style={{ background: '#fff' }}>
                     <div className="mediaWidth">
                        <h1 className="p-context-title">协同开票</h1>
                         <Row gutter={40} className="p-billing">
                             <Col span={12} className="p-billing-list">
                                 <h3>给<span className="c108ee9">万科、保利地产</span>开票入口</h3>
                                 <Card noHovering className="p-billing-itme">
                                     <Row gutter={24} className="p-billing-img">
                                         <Col span={6}>
                                             <img src={logoImg} />
                                         </Col>
                                         <Col span={6}>
                                             <img src={logoImg} />
                                         </Col>
                                         <Col span={6}>
                                             <img src={logoImg} />
                                         </Col>
                                         <Col span={6}>
                                             <img src={logoImg} />
                                         </Col>
                                         <Col span={6}>
                                             <img src={logoImg} />
                                         </Col>
                                         <Col span={6}>
                                             <img src={logoImg} />
                                         </Col>
                                         <Col span={6}>
                                             <img src={logoImg} />
                                         </Col>
                                         <Col span={6}>
                                             <img src={logoImg} />
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
                                             <img src={logoImg} />
                                         </Col>
                                         <Col span={6}>
                                             <img src={logoImg} />
                                         </Col>
                                         <Col span={6}>
                                             <img src={logoImg} />
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
                     </div>
                 </div>


                 <div className="p-main">
                     <div className="mediaWidth">
                         <h1 className="p-context-title">发票管理</h1>
                         <div className="p-invoice-main">
                             <Card noHovering  bordered={true} className="p-invoice-list">
                                 <Link to="/home">
                                     <img src={xxfp} alt="xxfp" />
                                 </Link>
                                 <h2>销项发票管理</h2>
                                 <p>管理已开具的增值税发票</p>
                             </Card>
                             <Card noHovering  bordered={true} className="p-invoice-list">
                                 <Link to="/home">
                                     <img src={xxfp} alt="xxfp" />
                                 </Link>
                                 <h2>销项发票管理</h2>
                                 <p>管理已开具的增值税发票</p>
                             </Card>
                             <Card noHovering  bordered={true} className="p-invoice-list">
                                 <Link to="/home">
                                     <img src={xxfp} alt="xxfp" />
                                 </Link>
                                 <h2>进项发票管理</h2>
                                 <p>管理已开具的增值税发票</p>
                             </Card>
                             <Card noHovering  bordered={true} className="p-invoice-list">
                                 <Link to="/home">
                                     <img src={xxfp} alt="xxfp" />
                                 </Link>
                                 <h2>销项发票管理</h2>
                                 <p>管理已开具的增值税发票</p>
                             </Card>
                         </div>
                     </div>
                 </div>


                 <div className="p-main" style={{ background: '#fff' }}>
                     <div className="mediaWidth">
                         <h1 className="p-context-title">
                             招标信息
                             <span style={{color:'#ddd',fontSize:12}}>
                                 （推荐来自<span className="c108ee9">万科、保利地产、深圳地铁集团</span>等最新招标信息）
                             </span>
                         </h1>

                         <div className="p-table-body">
                            <table>
                                <thead className="p-table-thead">
                                    <tr>
                                        <th>
                                            公告标题
                                        </th>
                                        <th>
                                            地区
                                        </th>
                                        <th>
                                            发布日期
                                        </th>
                                        <th>

                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="p-table-tbody">
                                    <tr className="p-table-row">
                                        <td>
                                            <h1>
                                                水务集团2017、2018年度PPR管材及管件采购入围项目
                                            </h1>
                                            <p>
                                                <Icon type="question" style={{ fontSize: 16, color: '#08c' }} />截止日期： 2017-07-06
                                                <Icon type="question" style={{ fontSize: 16, color: '#08c',marginLeft:'30px' }} />招标方 ：陕西雄峰钢构装饰工程有限公司
                                            </p>
                                        </td>
                                        <td>
                                            河北-石家庄
                                        </td>
                                        <td>
                                            2017-08-31
                                        </td>
                                        <td>
                                            <Button type="primary">了解详情</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                         </div>

                     </div>
                 </div>

             </Layout>
         )
     }
 }

 export default Home