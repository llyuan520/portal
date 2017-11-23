/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:29
 * description  :
 */
import React, { Component } from 'react';
import {Form, Row, Col, Input, Button, Icon,DatePicker,Select } from 'antd';
import { withRouter } from 'react-router'
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

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
                const data = {
                    ...values,
                    announcementDate : values.announcementDate && values.announcementDate.format('YYYY-MM-DD'),
                }
                this.props.search && this.props.search(data, Date.now());
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
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        const children = [];
        const data = [
            {
                label: '公告标题',
                type: 'text',
                fieldName: 'title'
            }, {
                label: '公告日期',
                type: 'rangePicker',
                fieldName: 'announcementDate'
            }, {
                label: '公告类型',
                type: 'select',
                fieldName: 'announcementType',
                items: [{
                    label: '普通公告',
                    value: '10',
                }, {
                    label: '重要公告',
                    value: '20',
                }]
            }, {
                label: '发布状态',
                type: 'select',
                fieldName: 'status',
                items: [{
                    label: '待发布',
                    value: '10',
                }, {
                    label: '已发布',
                    value: '20',
                }]
            }
        ];


        for (let i = 0; i < data.length; i++) {
            let inputComponent;
            if (data[i].type === 'text') {
                inputComponent = <Input placeholder={`请输入${data[i].label}`}/>;
            } else if (data[i].type === 'rangePicker') {
                inputComponent = <DatePicker placeholder={`请输入${data[i].label}`}/>;
            } else if (data[i].type === 'select') {
                inputComponent = (
                    <Select placeholder="请选择">
                        {
                            data[i].items.map((item, i) => <Option key={i} value={`${item.value}`}>{item.label}</Option>)
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
            }else{
                children.push(
                    <Col span={8} key={i} style={{display: i < count ? 'block' : 'none'}}>
                        <FormItem {...formItemLayout} label={data[i].label}>
                            {getFieldDecorator(data[i]['fieldName'], {
                                initialValue: data[i].initialValue || ''
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            }

        }
        return children.slice(start, end || null);
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
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
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