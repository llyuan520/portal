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

    componentDidMount(){

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

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
                                    label:'分类名称',
                                    type:'input',
                                    fieldName:'name'
                                }, {
                                    label:'分类来源',
                                    type:'select',
                                    fieldName:'source',
                                    options: [
                                        {
                                            value:'1',
                                            label:'手工指定',
                                        },{
                                            value:'2',
                                            label:'税收分类编码',
                                        }
                                    ],
                                }, {
                                    label:'分类关键字',
                                    type:'input',
                                    fieldName:'keywords',
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