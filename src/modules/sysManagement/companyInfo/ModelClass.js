/**
 * author       : liuliyuan
 * createTime   : 2017/9/29 18:06
 * description  :
 */
import React,{Component} from 'react';
import {Modal,Form,Input,message} from 'antd';
import {request} from '../../../utils';

const FormItem = Form.Item;
const { TextArea } = Input;

class EditAddWithClass extends Component{
    state = {
        submitLoading:false,
        modelClassModalKey:Date.now(),
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
            if (!err) {
                //console.log('Received values of form: ', values);
                this.mounted && this.setState({
                    submitLoading:true
                })

                if(this.props.modalType === 'create') {

                    const dataInfo = {...values,...this.props.params, level: this.props.params.level+1} //提交的时候为选中的当前级别加1，表示只添加到下层级

                    request.post('/companyType/saveCompanyTypeInfo', dataInfo)
                        .then(({data}) => {
                            if (data.code === 200) {
                                message.success('新增分类成功！', 4)
                                //新增成功，关闭当前窗口,刷新父级组件
                                this.props.changeVisable(false)
                                this.props.refreshCurdTableTree();
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

                    const updateDateInfo = {...this.props.defaultValue, ...values}

                    request.post('/companyType/updateCompanyTypeInfo', updateDateInfo)
                        .then(({data}) => {
                            if (data.code === 200) {
                                message.success('编辑分类成功！', 4)

                                //编辑成功，关闭当前窗口,刷新父级组件
                                this.props.changeVisable(false)
                                this.props.refreshCurdTableTree();

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
            }
        });
    }

    componentDidMount() {

        //console.log(this.props.keyVal);
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

        //console.log(nextProps)
        if(nextProps.selectedKeys !== this.props.selectedKeys){
            
        }


    }

    render() {
        const {modalType} = this.props;
        const defaultValue = {...this.props.defaultValue}
        const { getFieldDecorator } = this.props.form;

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

        return (
            <Modal
                key={this.state.modelClassModalKey}
                title={modalType ==='create' ? '新增分类' : '编辑分类' }
                visible={this.props.visible}
                okText="保存"
                cancelText="取消"
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="分类名称"
                        hasFeedback
                    >
                        {getFieldDecorator('name', {
                            initialValue: defaultValue.name || '',
                            rules: [
                                {
                                    required: true, message: '请输入名称',
                                },
                               /* {
                                    pattern:/^[^ ]+$/,message:'不能包含空格'
                                }*/
                            ],
                        })(
                            <Input placeholder="请输入分类名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="分类关键字"
                        hasFeedback
                    >
                        {getFieldDecorator('keywords', {
                            initialValue: defaultValue.keywords || '',
                            /*rules: [
                                {
                                    pattern:/^[^ ]+$/,message:'不能包含空格'
                                }
                            ],*/
                        })(
                            <Input placeholder="请输入分类关键字" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="分类描述"
                        hasFeedback
                    >
                        {getFieldDecorator('remark', {
                            initialValue: defaultValue.remark || '',
                            /*rules: [
                                {
                                    pattern:/^[^ ]+$/,message:'不能包含空格'
                                }
                            ],*/
                        })(
                            <TextArea placeholder="请输入分类描述" rows={4} />
                        )}
                    </FormItem>
                </Form>

            </Modal>
        );
    }
}

export default Form.create()(EditAddWithClass)