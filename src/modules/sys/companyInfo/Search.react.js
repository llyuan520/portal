/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:29
 * description  :
 */
import React, { Component } from 'react';
import {Form, Row, Col, Button, Icon} from 'antd';
import { withRouter } from 'react-router'
import {getFields} from '../../../utils'

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
                            getFields(0,3,this.props.form,[
                                {
                                    label:'公司名称',
                                    type:'input',
                                    fieldName:'companyName'
                                }, {
                                    label:'分类状态',
                                    type:'select',
                                    fieldName:'typeStatus',
                                    options: [
                                        {
                                            value:'1',
                                            label:'已分类',
                                        },{
                                            value:'-1',
                                            label:'未分类',
                                        }
                                    ],
                                }, {
                                    label:'纳税人识别号（统一社会信用代码）',
                                    type:'input',
                                    fieldName:'certificatesNo',
                                }
                            ])
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