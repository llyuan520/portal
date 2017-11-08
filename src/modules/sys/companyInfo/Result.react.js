/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:30
 * description  :
 */
import React,{PureComponent} from 'react';
import {Table,Row,Col,Badge,Icon,Button,message,Input,Modal,Form} from 'antd';
import {request} from '../../../utils';
import EditClass from './EditClass'

const FormItem = Form.Item;
const { TextArea } = Input;

class Result extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            pagination: {
                showSizeChanger:true,
                showQuickJumper:true,
                current:1,
                pageSize:10,
                showTotal:(total, range) => `总数: ${total} 条`,
            },
            tableLoading: false,
            tableKeyDate: Date.now(),

            selectedRows:[], //选中的list
            selectedRowKeys: [],  // Check here to configure the default column
            scopeloading: false,
            companyTypeloading: false,



            editClassVisible: false,
            editClassKey:Date.now()+'1',

            defaultItem: {},
            editBusinessScopeVisible: false,
            editBusinessScopeKey:Date.now()+'2',

        };
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.results = pager.pageSize = pagination.pageSize;
        this.mounted &&  this.setState({
            pagination: pager,
        });
        //设置去掉排序默认设置的值
        let sor = sorter.order ? sorter.order.replace('end', '') : undefined;

        this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sor,
            ...this.props.filters.values,

        });
    }

    fetch = (params = {}) => {

        this.mounted && this.setState({ tableLoading: true });
        //根据参数查询融资申请信息
        request.get('/companyInfo/queryCompanyInfoList',{
            params:{
                results: 10,
                ...params,
            }
        }).then(({data}) => {
            if(data.code===200) {
                const pagination = {...this.state.pagination};
                // Read total count from server
                pagination.total = data.data.total;
                this.mounted && this.setState({
                    data: [...data.data.list],
                    tableLoading: false,
                    pagination,
                });
            }
        });
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.mounted && this.setState({
            selectedRowKeys,
            selectedRows
        });
    }

    //弹出框
    handleEditScope = record =>{
        this.mounted &&  this.setState({
            editBusinessScopeVisible: true,
            defaultItem:record
        });
    }

    //选中多少条数据
    handleAssociationClass = (type, record) => {
        this.mounted &&  this.setState({
            editClassVisible: true,
            type: type,
            defaultItem:record
        });
    }


    //获取公司分类
    handleInitCompanyType=()=>{
        const bolist = {
            list : this.state.selectedRows.map(item=>{
                return {
                    companyName:item.companyName,
                    scope:item.scope,
                    uuid:item.uuid,
                }
            })
        };
        this.mounted && this.setState({ companyTypeloading: true });
        request.post('/companyInfo/initCompanyTypes', bolist)
            .then(({data}) => {
                if (data.code === 200) {
                    this.mounted && this.setState({
                        selectedRowKeys: [],
                        selectedRows:[],
                        companyTypeloading: false,
                    },()=>{
                        this.fetch();
                        message.success('初始化分类成功！')
                    });


                } else {
                    message.error(data.msg, 4)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.mounted && this.setState({
                    companyTypeloading: false
                })
            })
    }

    //获取经营范围
    handleInitScope=()=>{
        const bolist = {
            list : this.state.selectedRows.map(item=>{
                return {
                    companyName:item.companyName,
                    uuid:item.uuid,
                }
            })
        };
        this.mounted &&  this.setState({ scopeloading: true });
        request.post('/companyInfo/initScope', bolist)
            .then(({data}) => {
                if (data.code === 200) {
                    this.mounted && this.setState({
                        selectedRowKeys: [],
                        selectedRows:[],
                        scopeloading: false,
                    },()=>{
                        this.fetch();
                        message.success('获取经营范围成功！')
                    });

                } else {
                    message.error(data.msg, 4)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.mounted && this.setState({
                    scopeloading: false
                })
            })
    }

    refreshCurdTable=()=>{
        this.fetch();
    }

    componentDidMount() {
        this.fetch();
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

        //console.log(nextProps.filters.lastUpdated, this.props.filters.lastUpdated);

        //用来判断如果搜索字段是否有改变，改变了就需要把当前table选中页设置为1
        if(nextProps.filters.lastUpdated !== this.props.filters.lastUpdated){
            const currentPager = { ...this.state.pagination };
            currentPager.current = 1;
            this.mounted &&  this.setState({
                pagination: currentPager,
                tableKeyDate: nextProps.filters.lastUpdated,
            });
            this.mounted &&  this.fetch({
                ...nextProps.filters.values
            })
        }
    }

    render() {

        //跳转到详情页
        const columns = [
            {
                title: '公司名称',
                dataIndex: 'companyName',
            }, {
                title: '分类状态',
                dataIndex: 'typeStatus',
                render: (text, record) => {
                    let txt = '';
                    switch (parseInt(record.typeStatus,0)){
                        case 1:
                            txt = <Badge count={'已分类'} style={{ backgroundColor: '#87d068' }} />;
                            break;
                        case -1:
                            txt = <Badge count={'未分类'} style={{ backgroundColor: '#ccc' }} />;
                            break;
                        default:
                            break;
                    }
                    return txt;
                },
            }, {
                title: '纳税人识别号',
                dataIndex: 'businessLicenceNo',
            }, {
                title: '统一社会信用代码',
                dataIndex: 'certificatesNo',
            }, {
                title: '经营范围',
                dataIndex: 'scope',
                width:'30%'
            }, {
                title: '操作',
                dataIndex: '5',
                className:"textc",
                render: (text, record) => {
                    return(
                        <div>
                            <a onClick={()=>this.handleAssociationClass('look', record)} style={{color:'#333',marginRight:'10px',fontSize: 14}}>
                                <Icon title="查看分类" type="search" />
                            </a>
                            <a onClick={()=>this.handleEditScope(record)} style={{color:'#333',marginRight:'10px',fontSize: 14}}>
                                <Icon title="编辑经营范围" type="edit" />
                            </a>
                            <a onClick={()=>this.handleAssociationClass('edit', record)} style={{color:'#333',fontSize: 14}}>
                                <Icon title="关联分类" type="link" />
                            </a>
                        </div>
                    )

                },
            }
        ];

        const {scopeloading,companyTypeloading,selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div>
                <Row className="title" style={{marginTop:20}}>
                    <Col span={24}>
                        <h2>公司信息查询</h2>
                    </Col>
                </Row>
                <div className="resultWrap">
                    <div className="table-operations">
                        <Button type="primary"
                                ghost
                                disabled={!hasSelected}
                                loading={scopeloading}
                                onClick={this.handleInitScope}>
                            获取经营范围
                        </Button>
                        <Button type="primary"
                                ghost
                                disabled={!hasSelected}
                                loading={companyTypeloading}
                                onClick={this.handleInitCompanyType}>
                            初始化分类
                        </Button>
                    </div>

                    <Table columns={columns}
                           rowSelection={rowSelection}
                           key={this.state.tableKeyDate}
                           rowKey={record => record.uuid}
                           dataSource={this.state.data}
                           pagination={this.state.pagination}
                           loading={this.state.tableLoading}
                           onChange={this.handleTableChange}
                    />
                </div>


                <EditClass
                    key={this.state.editClassKey}
                    modalType={this.state.type}
                    defaultItem={this.state.defaultItem}
                    changeVisable={ status =>{
                        this.setState({
                            editClassVisible:status,
                            editClassKey:Date.now()
                        })
                    }}
                    refreshCurdTable={this.refreshCurdTable.bind(this)}
                    visible={this.state.editClassVisible} />

                <EditBusinessScopeModel
                    key={this.state.editBusinessScopeKey}
                    defaultItem={this.state.defaultItem}
                    changeVisable={ status =>{
                        this.setState({
                            editBusinessScopeVisible:status,
                            editBusinessScopeKey:Date.now()
                        })
                    }}
                    refreshCurdTable={this.refreshCurdTable.bind(this)}
                    visible={this.state.editBusinessScopeVisible} />

            </div>
        );
    }
}

export default Result


class EditBusinessScope extends PureComponent{
    state = {
        submitLoading:false,
        editBusinessScopesModalKey:Date.now(),
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
                // console.log('Received values of form: ', values);
                this.mounted && this.setState({
                    submitLoading:true
                })

                request.post('/companyInfo/updateCompanyInfo', {...values,uuid:this.props.defaultItem.uuid})
                    .then(({data}) => {
                        if (data.code === 200) {
                            message.success('保存成功！', 4)
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
        });
    }

    componentDidMount() {

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.defaultItem !== this.props.defaultItem){

        }

    }

    render() {

        const defaultItem = {...this.props.defaultItem};
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                key={this.state.editBusinessScopesModalKey}
                confirmLoading={this.state.submitLoading}
                title="编辑"
                visible={this.props.visible}
                okText="保存"
                cancelText="取消"
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <FormItem
                        label="经营范围"
                    >
                        {getFieldDecorator('scope', {
                            initialValue: defaultItem.scope || '',
                        })(
                            <TextArea placeholder="请输入分类描述" rows={8} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const EditBusinessScopeModel = Form.create()(EditBusinessScope);



