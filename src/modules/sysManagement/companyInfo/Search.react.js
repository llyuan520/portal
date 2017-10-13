/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:29
 * description  :
 */
import React, { Component } from 'react';
import {Form, Row, Col, Input, Button, Icon,Select} from 'antd';
import { withRouter } from 'react-router'


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
                label:'分类名称',
                type:'text',
                fieldName:'name'
            },
            {
                label:'分类来源',
                type:'select',
                fieldName:'source',
                items: [
                    {
                        value:'1',
                        label:'已分类',
                    },{
                        value:'-1',
                        label:'未分类',
                    }
                ],
            },
            {
                label:'分类关键字',
                type:'text',
                fieldName:'keywords',
            }

        ]


        for (let i = 0; i < data.length; i++) {
            let inputComponent;
            if(data[i].type==='text'){
                inputComponent = <Input placeholder={`请输入${data[i].label}`} />;
            }else if(data[i].type==='select'){
                inputComponent = (
                    <Select placeholder={`请选择${data[i].label}`}>
                        {
                            data[i].items.map((item,i)=><Option key={i} value={item.value}>{item.label}</Option>)
                        }
                    </Select>
                )
            }
            children.push(
                <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none'}}>
                    <FormItem {...formItemLayout} label={data[i].label}>
                        {getFieldDecorator(data[i]['fieldName'],{
                            initialValue:data[i].initialValue || undefined
                        })(
                            inputComponent
                        )}
                    </FormItem>
                </Col>
            );
        }
        return children.slice(start,end||null);
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
                            this.getFields(0,3)
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