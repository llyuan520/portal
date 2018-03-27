/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:29
 * description  :
 */
import React, { Component } from 'react';
import {Form, Row, Col, Input, Button, Icon,Select,DatePicker} from 'antd';
import { withRouter } from 'react-router'
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;
const Option = Select.Option;

class Search extends Component {
    constructor(props){
        super(props)
        this.state = {
            expand: true,
            projectCompany:[],
            projectCompanyLoaded:false,
            data: [],
            status: undefined,
        };

    }

    handleSearch = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.createdDate && values.createdDate.length!==0){
                    values.createdDateStart = values.createdDate[0].format('YYYY-MM-DD')
                    values.createdDateEnd = values.createdDate[1].format('YYYY-MM-DD')
                    values.createdDate = undefined;
                }
                this.props.search && this.props.search(values, Date.now());
            }

        });
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    getFields(start,end) {
        const count = this.state.expand ? 10 : 0;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const children = [

        ];
        const data = [
            {
                label:'用户名',
                type:'text',
                fieldName:'username'
            },{
                label:'公司名称',
                type:'text',
                fieldName:'companyName'
            },{
                label:'手机号',
                type:'text',
                fieldName:'phone'
            },{
                label:'创建时间起止',
                type: 'rangePicker',
                fieldName:'createdDate'
            }
        ]


        for (let i = 0; i < data.length; i++) {
            let inputComponent;
            if(data[i].type==='text'){
                inputComponent = <Input placeholder={`请输入${data[i].label}`} />;
            } else if (data[i].type === 'rangePicker') {
                inputComponent = <RangePicker format={dateFormat} style={{width:'100%'}} />;
            } else if (data[i].type==='select'){
                inputComponent = (
                    <Select placeholder={`请选择${data[i].label}`}>
                        {
                            data[i].items.map((item,i)=><Option key={i} value={item.value}>{item.label}</Option>)
                        }
                    </Select>
                )
            }
            if(data[i].type === 'rangePicker'){
                children.push(
                    <Col span={8} key={i} style={{display: i < count ? 'block' : 'none'}}>
                        <FormItem {...formItemLayout} label={data[i].label}>
                            {getFieldDecorator(data[i]['fieldName'], {
                                initialValue: data[i].initialValue
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            }else {
                children.push(
                    <Col span={8} key={i} style={{display: i < count ? 'block' : 'none'}}>
                        <FormItem {...formItemLayout} label={data[i].label}>
                            {getFieldDecorator(data[i]['fieldName'], {
                                initialValue: data[i].initialValue || undefined
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            }
        }
        return children.slice(start,end||null);
    }


    componentDidMount(){

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    render(){
        return (
            <div>
                <h2 className="title">
                    查询条件
                    <span style={{float:'right',cursor:'pointer' }} onClick={this.toggle}>
                        <Icon type={this.state.expand ? 'up-circle-o' : 'down-circle-o'} />
                    </span>
                </h2>

                <Form
                    onSubmit={this.handleSearch}
                    className="search-from"
                    style={{display:this.state.expand ? 'block' : 'none'}}
                >

                    <Row gutter={40}>
                        {
                            this.getFields(0,3)
                        }
                        {
                            this.getFields(3,4)
                        }
                        <Col span={16} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                重置
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }

}
export default Form.create()(withRouter(Search))