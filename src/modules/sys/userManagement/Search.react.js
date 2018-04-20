/**
 * author       : LiuLiYuan
 * createTime   : 2017/9/28 15:29
 * description  :
 */
import React, { Component } from 'react';
import {Form, Row, Col, Button, Icon} from 'antd';
import { withRouter } from 'react-router'
import moment from 'moment';
import {getFields,regRules} from 'utils'

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
                if (values.createdDate && values.createdDate.length !== 0) {
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
        //手动触发一下是因为使用resetFields()不会触发form的onValuesChange
        this.props.onValuesChange({})
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
                                    label:'用户名',
                                    type:'input',
                                    fieldName:'username'
                                },{
                                    label:'公司名称',
                                    type:'input',
                                    fieldName:'companyName'
                                },{
                                    label:'手机号',
                                    type:'input',
                                    fieldName:'phone',
                                    fieldDecoratorOptions:{
                                        rules:[
                                            regRules.mobile_phone,
                                        ]
                                    },
                                },{
                                    label:'创建时间起止',
                                    type: 'rangePicker',
                                    fieldName:'createdDate'
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

export default Form.create({
    onValuesChange(props, values) { props.onValuesChange(values) }
})(withRouter(Search))
