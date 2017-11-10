/**
 * author       : liuliyuan
 * createTime   : 2017/10/17 15:08
 * description  :
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Modal,Form,Input,message,Row,Col,Checkbox,DatePicker,icon} from 'antd';
import {request} from '../../../utils';
import oauth from '../../../oAuth';
import moment from 'moment';

import Ueditor from '../../../components/ueditor/Ueditor.react'



/*import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { BlockPicker } from 'react-color';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';*/

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item;

class EditAddModel extends Component{
    constructor(props) {
        super(props);


        this.state = {
            submitLoading:false,
            modelClassModalKey:Date.now(),
            editorStateKey:Date.now()+1,
        }
    }


    static defaultProps={
        modalType:'create'
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
            //const data = UE.getEditor('content').getContent()
            console.log(values);
            if (!err) {


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


    uploadImageCallBack = (file)=> {

        const formData = new FormData(); // eslint-disable-line no-undef
        formData.append('image', file);
        let config = {
            headers:{
                'Content-Type':'multipart/form-data'

            }
        };  //添加请求头

        return new Promise((resolve,reject)=>{
            let reader=new FileReader();
            reader.onloadend = function() {
                request.post('http://192.168.3.77/financingQuery/uploadFile?financeApplyId=123456&resourceListId=456789', formData, config)
                    .then(res => {
                        resolve({data: {link: reader.result}});
                    }).catch(res => {
                    reject(res.message);
                })
            }
            reader.readAsDataURL(file);
        })



       /* return new Promise(
            (resolve, reject) => {
                let reader=new FileReader();

                reader.onloadend = function() {

                    const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
                    xhr.open('POST', 'http://192.168.3.77/financingQuery/uploadFile?financeApplyId=123456&resourceListId=456789');
                    xhr.setRequestHeader('Authorization', oauth.getToken());
                    const data = new FormData(); // eslint-disable-line no-undef
                    data.append('image', file);
                    xhr.send(data);
                    xhr.addEventListener('load', () => {
                        resolve({data: {link: reader.result}});
                    });
                    xhr.addEventListener('error', () => {
                        reject('error');
                    });

                }

                reader.readAsDataURL(file);
            }
        );*/

    }


    componentDidMount() {

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }


    componentWillReceiveProps(nextProps){

        console.log(nextProps)

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
                                hasFeedback
                            >
                                {getFieldDecorator('bulletinTitle', {
                                    initialValue: defaultValueDate.gysUserName || '',
                                    rules: [
                                        {
                                            required: true, message: '请输入公告标题',
                                        }
                                    ],
                                })(
                                    <Input disabled={modalType ==='edit' && !!defaultValueDate.gysUserName } placeholder="请输入公告标题" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="公告类型"
                                hasFeedback
                            >
                                {getFieldDecorator('bulletinType', {
                                    initialValue: defaultValueDate.gysUserName || '',
                                    rules: [
                                        {
                                            required: true, message: '请选择公告类型',
                                        }
                                    ],
                                })(
                                    <Input disabled={modalType ==='edit' && !!defaultValueDate.gysUserName } placeholder="请选择公告类型" />
                                )}
                            </FormItem>
                        </Col>
                        {/*<Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="公告日期"
                                hasFeedback
                            >
                                {getFieldDecorator('bulletinDate', {
                                    initialValue: defaultValueDate.gysUserName || '',
                                    rules: [
                                        {
                                            required: true, message: '请选择公告日期',
                                        }
                                    ],
                                })(
                                    <Input disabled={modalType ==='edit' && !!defaultValueDate.gysUserName } placeholder="请选择公告日期" />
                                )}
                            </FormItem>
                        </Col>*/}
                    </Row>

                    <Row gutter={24}>
                        <Col>
                            <FormItem
                                {...formInnerLayout}
                                label="公告内容"
                                hasFeedback
                            >
                                {getFieldDecorator('content', {
                                    initialValue: defaultValueDate.gysUserName || '',
                                    rules: [
                                        {
                                            required: true, message: '请输入公告内容!',
                                        }
                                    ],
                                })(
                                    <Ueditor  id="content" height="200" />
                                )}
                            </FormItem>

                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="发布路径"
                                hasFeedback
                            >
                                {getFieldDecorator('bulletinUrl', {
                                    initialValue: defaultValueDate.gysUserName || '',
                                    rules: [
                                        {
                                            required: true, message: '请输入发布路径',
                                        }
                                    ],
                                })(
                                    <Input disabled={modalType ==='edit' && !!defaultValueDate.gysUserName } placeholder="请输入发布路径" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="版本号"
                                hasFeedback
                            >
                                {getFieldDecorator('versionNumber', {
                                    initialValue: defaultValueDate.gysUserName || '',
                                })(
                                    <Input disabled={modalType ==='edit' && !!defaultValueDate.gysUserName } placeholder="请输入版本号" />
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
                                    initialValue: defaultValueDate.gysUserName || '',
                                })(
                                    <Checkbox> 是否定时发布 </Checkbox>
                                )}
                            </FormItem>
                        </Col>
                        {/*<Col span={12}>
                            {
                                getFieldValue('isRelease')  && <FormItem
                                    {...formItemLayout}
                                    label="发布时间"
                                    hasFeedback
                                >
                                    {getFieldDecorator('releaseTime', {
                                        initialValue: defaultValueDate.gysUserName || '',
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

                        </Col>*/}
                    </Row>
                </Form>

            </Modal>
        );
    }
}

export default Form.create()(EditAddModel)