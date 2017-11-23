/**
 * author       : liuliyuan
 * createTime   : 2017/10/17 15:08
 * description  :
 */
import React,{Component} from 'react';
import {Modal,Form,Input,message,Row,Col,Checkbox,DatePicker,Select,Upload,Button, Icon} from 'antd';
import {request,htmlDecode} from '../../../utils';
import moment from 'moment';

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
            fileList: [],

            submitLoading:false,
            modelClassModalKey:Date.now()+4,

            //公告类型
            bType:[
                {
                    key:'20',
                    val:'重要公告'
                },{
                    key:'10',
                    val:'普通公告'
                },
            ],
            //发布路径
            bPlatform:[
                {
                    key:'10',
                    val:'喜盈佳云平台'
                },{
                    key:'20',
                    val:'供应商门户'
                },
            ],
            //公告发布对象 所有用户、指定用户、指定公司
            newOptions : [
                { label: '所有用户', value: '10' },
                { label: '指定公司', value: '20' },
                { label: '指定用户', value: '30' },
            ],
        }
    }

    static defaultProps={
        modalType:'create',
    }

    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    handleOk = (e) => {
        this.handleSubmit()
    }
    handleCancel = (e) => {
        this.props.changeVisable(false);
        this.props.refreshCurdTable();
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {


            //上传文件和参数一起提交到后台
            const { fileList } = this.state;

            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('files', file);
            });

            const defaultValueDate = {...this.props.defaultValueDate};
            const data = {
                ...values,
                type: values.type === true ? '20' : '10',
                announcementDate : values.announcementDate && values.announcementDate.format('YYYY-MM-DD'),
                publishTime: values.publishTime && values.publishTime.format('YYYY-MM-DD HH:mm:ss'),
                status: (defaultValueDate && defaultValueDate.status) || '10',
                uuid: defaultValueDate && defaultValueDate.uuid,
                files: defaultValueDate && defaultValueDate.fileId,
            }
            console.log(data);

            if (!err) {

                this.mounted && this.setState({
                    submitLoading:true
                })

                if(this.props.modalType === 'create') {
                    request.post('/announcement/save', formData,{
                        params:{...data}
                    })
                        .then(({data}) => {
                            if (data.code === 200) {
                                message.success('新增成功！', 4)
                                //新增成功，关闭当前窗口,刷新父级组件
                                this.props.changeVisable(false);
                                this.props.refreshCurdTable();
                            } else {
                                message.error(data.msg, 4)
                                this.mounted && this.setState({
                                    submitLoading: false
                                })
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

                    request.post('/announcement/update', formData,{
                        params:{...data}
                    })
                        .then(({data}) => {
                            if (data.code === 200) {
                                message.success('编辑成功！', 4);

                                //编辑成功，关闭当前窗口,刷新父级组件
                                this.props.changeVisable(false);
                                this.props.refreshCurdTable();

                            } else {
                                message.error(data.msg, 4)
                                this.mounted && this.setState({
                                    submitLoading: false
                                })
                            }
                        })
                        .catch(err => {
                            message.error(err.message)
                            this.mounted && this.setState({
                                submitLoading: false
                            })
                        })
                }
            }
        })
    }


    componentDidMount() {

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

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

        const remove = file =>{
            this.setState(({ fileList }) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return {
                    fileList: newFileList,
                };
            });
        }

        //手动上传
        const props = {
            //action: `${window.baseURL}/announcement/uploadFile`,
           // headers: { authorization:oauth.getToken(),},
            accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            multiple:false,
            onPreview(file){
                if(!!defaultValueDate.fileId){
                    let url = `${window.baseURL}announcement/downloadFile/${defaultValueDate.fileId}`;
                    let elemIF = document.createElement("iframe");
                    elemIF.src = url;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }

            },
            onRemove: (file) => {
                if(file.status==='error'){
                    return true;
                }
                if(file.uuid && file.uid){
                    return new Promise((resolve,reject)=>{
                        request.delete(`/announcement/deleteFile/${file.uuid}/${file.uid}`)
                            .then(({data})=>{
                                if(data.code===200){
                                    message.success('删除成功');
                                    remove(file);
                                    resolve()
                                }else{
                                    message.error(`删除失败,${data.msg}`)
                                    reject(data.msg);
                                }
                            }).catch(err=>{
                            reject(err.message);
                        })
                    })
                }else{
                    remove(file);
                }

                //return false;

            },
            beforeUpload: (file) => {
                remove(file);

                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            defaultFileList: defaultValueDate.fileId && [{
                uid: defaultValueDate.fileId,      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
                name: defaultValueDate.fileName,   // 文件名
                status: 'done', // 状态有：uploading done error removed
                url:`${window.baseURL}/announcement/downloadFile/${defaultValueDate.fileId}`,//文件链接
                uuid:defaultValueDate.uuid,
            }],
        };

        //自定义
        const isNotDate = {
            rules: [
                {
                    required: true, message: '请选择发布时间',
                }
            ],
        };

        if(!!defaultValueDate.publishTime){
            isNotDate.initialValue = moment(`${defaultValueDate.publishTime}`);
        }

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
                                {getFieldDecorator('announcementType', {
                                    initialValue: defaultValueDate.announcementType && `${defaultValueDate.announcementType}`,
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
                                {getFieldDecorator('announcementDate', {
                                    initialValue: defaultValueDate.announcementDate && moment(`${defaultValueDate.announcementDate}`, 'YYYY-MM-DD'),
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
                                        initialValue: htmlDecode(defaultValueDate.content) || '',
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
                                label="通知对象"
                            >
                                {getFieldDecorator('rangeType', {
                                    initialValue: (defaultValueDate.rangeType && `${defaultValueDate.rangeType}`) || '10',
                                    rules: [
                                        {
                                            required: true, message: '请选择公告通知对象',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择公告类型">
                                        {
                                            this.state.newOptions.map((item,i)=><Option key={i} value={item.value}>{item.label}</Option>)
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            {
                                (getFieldValue('rangeType') !== '10') && <FormItem
                                    {...formItemLayout}
                                    label="添加附件"
                                >
                                    {getFieldDecorator('files', {
                                        initialValue: defaultValueDate && defaultValueDate.fileId,
                                        rules: [
                                            { required: true, message: '请添加附件'
                                            }
                                        ],
                                        getValueFromEvent: this.normFile,
                                    })(
                                        <Upload {...props} >
                                            <Button>
                                                <Icon type="upload" /> 上传附件
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>
                            }
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout}
                                label="发布平台"
                            >
                                {getFieldDecorator('announcementPath', {
                                    initialValue: defaultValueDate.announcementPath && `${defaultValueDate.announcementPath}`,
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
                                {getFieldDecorator('version', {
                                    initialValue: defaultValueDate.version || '',
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
                                {getFieldDecorator('type', {
                                    initialValue: defaultValueDate.type,
                                    valuePropName:'checked',
                                })(
                                    <Checkbox> 是否定时发布 </Checkbox>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            {
                                getFieldValue('type') === true &&  <FormItem
                                    {...formItemLayout}
                                    label="发布时间"

                                >
                                    {getFieldDecorator('publishTime', isNotDate)(
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择发布时间" />
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