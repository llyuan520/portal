/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:29
 * description  :
 */
import React, { Component } from 'react';
import {Form, Row, Col, Button, Icon,} from 'antd';
import { withRouter } from 'react-router'
import {getFields} from '../../../utils'
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

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
                            getFields(0,4,this.props.form,[
                                {
                                    label: '公告标题',
                                    type: 'input',
                                    fieldName: 'title'
                                }, {
                                    label: '公告日期',
                                    type: 'datePicker',
                                    fieldName: 'announcementDate'
                                }, {
                                    label: '公告类型',
                                    type: 'select',
                                    fieldName: 'announcementType',
                                    options: [{
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
                                    options: [{
                                        label: '待发布',
                                        value: '10',
                                    }, {
                                        label: '已发布',
                                        value: '20',
                                    }]
                                }
                            ])
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