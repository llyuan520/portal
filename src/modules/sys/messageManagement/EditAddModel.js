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

import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { BlockPicker } from 'react-color';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item;

const html = '<p>阿斯顿发送到方式</p>';
class EditAddModel extends Component{
    constructor(props) {
        super(props);

        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorStates = EditorState.createWithContent(contentState);

        this.state = {
            isContent : '',

            submitLoading:false,
            modelClassModalKey:Date.now(),
            editorState:  contentBlock && editorStates,
            editorStateKey:Date.now()+1,
        }
    }


    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        },()=>{
            // draftToHtml 获取html  draftToMarkdown 获取存内容
            const contexts = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            const str = contexts.replace(/<[^>]+>/g,"");//去掉所有的html标记
            const tirm = str.replace(/&nbsp;/ig, ""); //将字符串中的&nbsp;全部替换为空字符串

            //为了设置提示信息
            if(tirm.length > 1){
                this.setState({
                    isContent : 'success',
                })

                //setFieldsValue是将富文本的内容传给content
                this.props.form.setFieldsValue({
                    content:contexts
                });
            }else{
                this.setState({
                    isContent : 'error',
                })
                this.props.form.setFields({
                    context: {
                        errors: [new Error('请输入公告内容')],
                    },
                });
            }

        });
    };

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
            if (!err) {

                console.log('Received values of form: ', values);

                /*draftToHtml(convertToRaw(editorState.getCurrentContent()))*/
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
        const { editorState,isContent } = this.state;
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
                        <Col span={12}>
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
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col>
                            <FormItem
                                {...formInnerLayout}
                                label="公告内容"
                                hasFeedback
                                validateStatus={isContent}
                                help={ isContent === 'error' && '请输入公告内容!' }

                            >
                                {getFieldDecorator('content', {
                                    initialValue: defaultValueDate.gysUserName || '',
                                    rules: [
                                        {
                                            required: true, message: '请输入公告内容!',
                                        }
                                    ],
                                })(
                                    <div>
                                        <Editor
                                            key={this.state.editorStateKey}
                                            editorState={editorState}
                                            wrapperClassName="demo-wrapper"
                                            editorClassName="demo-editor"
                                            onEditorStateChange={this.onEditorStateChange}
                                            toolbar={{
                                                colorPicker: { component: ColorPic },
                                                image: {
                                                    uploadCallback: this.uploadImageCallBack,
                                                    alt: { present: true, mandatory: false },
                                                },
                                            }}
                                            localization={{
                                                locale: 'zh',
                                            }}
                                        />
                                    </div>
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
                        <Col span={12}>
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

                        </Col>
                    </Row>
                </Form>

            </Modal>
        );
    }
}

export default Form.create()(EditAddModel)


class ColorPic extends Component {
    static propTypes = {
        expanded: PropTypes.bool,
        onExpandEvent: PropTypes.func,
        onChange: PropTypes.func,
        currentState: PropTypes.object,
    };

    stopPropagation = (event) => {
        event.stopPropagation();
    };

    onChange = (color) => {
        const { onChange } = this.props;
        onChange('color', color.hex);
    }

    renderModal = () => {
        const { color } = this.props.currentState;
        return (
            <div
                onClick={this.stopPropagation}
                className="demo-color-modal"
            >
                <BlockPicker color={color} onChangeComplete={this.onChange} />
            </div>
        );
    };

    render() {
        const { expanded, onExpandEvent } = this.props;
        return (
            <div
                aria-haspopup="true"
                aria-expanded={expanded}
                aria-label="rdw-color-picker"
                className="rdw-inline-wrapper"
                style={{position: 'relative'}}
            >
                <div
                    className="rdw-option-wrapper"
                    onClick={onExpandEvent}
                >
                    <img
                        style={{width:'20px'}}
                        src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQ5NS41NzggNDk1LjU3OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDk1LjU3OCA0OTUuNTc4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0U2QkU5NDsiIGQ9Ik00MzkuMjA4LDIxNS41NzhjLTQ2Ljk3NS01My41MjktOTYtNjUuOTczLTk2LTEyNWMwLTY0LjMzMy01NC4zMzMtMTEzLjY2Ny0xNDkuNDI5LTc5LjMyMQoJCQlDOTEuODE2LDQ4LjA4MywyMS4yMDgsMTM2LjkxMSwyMS4yMDgsMjQ3LjU3OGMwLDEzNi45NjYsMTExLjAzMywyNDgsMjQ4LDI0OGMyMi41MjcsMCw0NC4zNTQtMy4wMDQsNjUuMDk5LTguNjMybC0wLjAwNi0wLjAyNgoJCQlDNDM5LjIwOCw0NTYuNTc4LDUyNS4yMDgsMzEzLjU3OCw0MzkuMjA4LDIxNS41Nzh6IE0zMzMuNzA5LDE4OS42OWMtMTQuNTAxLDE4LjU1NS01NC42NjgsNy43MDctNzAuMTctMTguNTQ3CgkJCWMtMTMuNjY0LTIzLjE0LTguNjY0LTU2LjIzMiwxNC45ODgtNzAuODIyYzEzLjcxLTguNDU3LDMxLjc5MS0wLjEzNSwzNS4yMzEsMTUuNjAyYzIuOCwxMi44MDYsOC41NDMsMjguNjcxLDIwLjIzOSw0My4xODcKCQkJQzM0MS4xMjUsMTY3Ljk2LDM0MC43MDcsMTgwLjczNiwzMzMuNzA5LDE4OS42OXoiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGNEYxOTsiIGN4PSIxNjUuMDk4IiBjeT0iMTM1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGOEM2MjsiIGN4PSIxNzYuOTQiIGN5PSIxMjMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGQ0QwMDsiIGN4PSIxMTcuMDk4IiBjeT0iMjU1LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRTY3MTsiIGN4PSIxMjguOTQiIGN5PSIyNDMuNzE1IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzAwQzM3QTsiIGN4PSIxNzIuODc5IiBjeT0iMzY3LjQ2OSIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzYwREM0RDsiIGN4PSIxODQuNzIiIGN5PSIzNTUuNDk2IiByPSIxNi43NjIiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzRDRDdGRjsiIGN4PSIyOTMuMDk4IiBjeT0iNDA3LjY4OCIgcj0iNDcuODkiLz4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0FFRUZGRjsiIGN4PSIzMDQuOTM5IiBjeT0iMzk1LjcxNSIgcj0iMTYuNzYyIi8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiMwMDlCQ0E7IiBjeD0iMzgxLjA5OCIgY3k9IjMxOS40NjkiIHI9IjQ3Ljg5Ii8+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiM0Q0Q3RkY7IiBjeD0iMzkyLjkzOSIgY3k9IjMwNy40OTYiIHI9IjE2Ljc2MiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo='
                        alt=""
                    />
                </div>
                {expanded ? this.renderModal() : undefined}
            </div>
        );
    }
}