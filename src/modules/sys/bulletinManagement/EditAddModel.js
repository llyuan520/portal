/**
 * author       : liuliyuan
 * createTime   : 2017/10/17 15:08
 * description  :
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Modal,Form,Input,message,Row,Col,Checkbox,DatePicker,icon,Select} from 'antd';
import {request} from '../../../utils';
import oauth from '../../../oAuth';
import moment from 'moment';

/*import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { BlockPicker } from 'react-color';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';*/

import SimpEditor from '../../../components/ueditor/Ueditor.react';

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;

class EditAddModel extends Component{
    constructor(props) {
        super(props);


        this.state = {
            isContent : '',

            submitLoading:false,
            modelClassModalKey:Date.now(),

            //公告类型
            bType:[
                {
                    key:'0',
                    val:'重要公告'
                },{
                    key:'1',
                    val:'普通公告'
                },
            ],
            //发布路径
            bPlatform:[
                {
                    key:'0',
                    val:'喜盈佳云平台'
                },{
                    key:'1',
                    val:'供应商门户'
                },
            ],
            checked:false,
        }
    }

    static defaultProps={
        modalType:'create',
    }


    handleOk = (e) => {
        this.handleSubmit()
    }
    handleCancel = (e) => {
        this.props.changeVisable(false);
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(this.props, values);
                console.log(this.props.content, values);

                /*this.mounted && this.setState({
                    submitLoading:true
                })

                if(this.props.modalType === 'create') {

                    request.post('/userManage/saveUserInfo', {...values})
                        .then(({data}) => {
                            if (data.code === 200) {
                                message.success('新增成功！', 4)
                                //新增成功，关闭当前窗口,刷新父级组件
                                this.props.changeVisable(false);
                                this.props.refreshCurdTable();
                            } else {
                                message.error(data.msg, 4)
                            }
                        })
                        .catch(err => {
                            message.error(err.message)
                            this.mounted && this.setState({
                                submitLoading: false
                            })
                        })
                }

                if(this.props.modalType === 'edit'){

                    const defaultValueDate = {...this.props.defaultValueDate};
                    const data = {...values};
                    data.sysGYLUserWebParam['id'] = defaultValueDate.gylUserId;
                    data.sysPYTUserWebParam['id'] = defaultValueDate.pytUserId;
                    data.sysUserWebParam['userId'] = defaultValueDate.uuid;
                    data.sysXYJUserWebParam['id'] = defaultValueDate.xyjUserId;

                    request.post('/userManage/modifyUserInfo', {...data})
                        .then(({data}) => {
                            if (data.code === 200) {
                                message.success('编辑成功！', 4);

                                //编辑成功，关闭当前窗口,刷新父级组件
                                this.props.changeVisable(false);
                                this.props.refreshCurdTable();

                            } else {
                                message.error(data.msg, 4)
                            }
                        })
                        .catch(err => {
                            message.error(err.message)
                            this.mounted && this.setState({
                                submitLoading: false
                            })
                        })
                }*/
            }
        });
    }

    componentDidMount() {

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }


    componentWillReceiveProps(nextProps){

        console.log(nextProps)
        if(nextProps.defaultValueDate){
            this.setState({
                checked : nextProps.defaultValueDate.isRelease,
            })
        }


    }

    render() {

        const {modalType} = this.props;
        const defaultValueDate = {...this.props.defaultValueDate};

        const { getFieldDecorator, getFieldValue } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const formInnerLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 19 },
        };
        const formTailLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16, offset: 6 },
        };

        return (
            <Modal
                key={this.state.modelClassModalKey}
                confirmLoading={this.state.submitLoading}
                title={modalType ==='create' ? '新增公告' : '编辑公告' }
                visible={this.props.visible}
                okText="保存"
                cancelText="取消"
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width="850px"
            >
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col>
                            <FormItem
                                {...formInnerLayout}
                                label="公告标题"

                            >
                                {getFieldDecorator('title', {
                                    initialValue: defaultValueDate.title || '',
                                    rules: [
                                        {
                                            required: true, message: '请输入公告标题',
                                        }
                                    ],
                                })(
                                    <Input placeholder="请输入公告标题" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="公告类型"

                            >
                                {getFieldDecorator('type', {
                                    initialValue: defaultValueDate.type || '',
                                    rules: [
                                        {
                                            required: true, message: '请选择公告类型',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择公告类型">
                                        {
                                            this.state.bType.map((item,i)=><Option key={i} value={item.key}>{item.val}</Option>)
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="公告日期"

                            >
                                {getFieldDecorator('date', {
                                    initialValue: defaultValueDate.date && moment(`${defaultValueDate.date}`, 'YYYY-MM-DD'),
                                    rules: [
                                        {
                                            required: true, message: '请选择公告日期',
                                        }
                                    ],
                                })(
                                    <DatePicker placeholder="请选择公告日期" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col>
                            <FormItem
                                {...formInnerLayout}
                                label="公告内容"
                            >
                                <div id="content">
                                    {getFieldDecorator('content', {
                                        initialValue: defaultValueDate.content || '',
                                        rules: [{
                                            required: true, message: '请填写公告内容!'
                                        }],
                                    })(
                                        <SimpEditor id="content" placeholder="请填写公告内容!"  />
                                    )}
                                </div>
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="发布平台"

                            >
                                {getFieldDecorator('platform', {
                                    initialValue: defaultValueDate.platform || '',
                                    rules: [
                                        {
                                            required: true, message: '请选择发布平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择发布平台">
                                        {
                                            this.state.bPlatform.map((item,i)=><Option key={i} value={item.key}>{item.val}</Option>)
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="版本号"

                            >
                                {getFieldDecorator('versionNumber', {
                                    initialValue: defaultValueDate.versionNumber || '',
                                })(
                                    <Input placeholder="请输入版本号" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem
                                {...formTailLayout}
                            >
                                {getFieldDecorator('isRelease', {
                                })(
                                    <Checkbox checked={this.state.checked}
                                              onChange={(e) => {
                                                  console.log('checked = ', e.target.checked);
                                                  this.mounted && this.setState({
                                                      checked: e.target.checked,
                                                  });
                                              }}
                                    > 是否定时发布 </Checkbox>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            {
                                this.state.checked &&  <FormItem
                                    {...formItemLayout}
                                    label="发布时间"

                                >
                                    {getFieldDecorator('time', {
                                        initialValue: defaultValueDate.time && moment(`${defaultValueDate.time}`, 'YYYY-MM-DD'),
                                        rules: [
                                            {
                                                required: true, message: '请选择发布时间',
                                            }
                                        ],
                                    })(
                                        <DatePicker placeholder="请选择发布时间" />
                                    )}
                                </FormItem>
                            }
                        </Col>
                    </Row>
                </Form>

            </Modal>
        );
    }
}

export default Form.create()(EditAddModel)