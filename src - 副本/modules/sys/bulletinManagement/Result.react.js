/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:30
 * description  :
 */
import React,{PureComponent} from 'react';
import {Table,Row,Col,Badge,Icon,Button,message,Modal} from 'antd';
import {request} from '../../../utils';
import EditAddModel from './EditAddModel'

const confirm = Modal.confirm;
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

            selectedRowKeys: [],  // Check here to configure the default column

            editAddVisible: false,
            editAddKey:Date.now()+'1',
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
        request.get('/userManage/loadUsersInfo',{
            params:{
                results: 10,
                ...params,
            }
        }).then(({data}) => {
            console.log(data);
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

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.mounted && this.setState({ selectedRowKeys });
    }

    //弹出框
    showModal = (type,record) =>{
        this.mounted && this.setState({
            editAddVisible: true,
            type: type,
            defaultValueDate: record,
        });
    }

    //删除
    handleDelect = id =>{
        this.mounted && this.setState({ tableLoading: true });
        request.post(`/companyType/deleteCompanyTypeInfo?uuid=${id}`, {
        })
            .then(({data}) => {
                if (data.code === 200) {
                    this.mounted && this.setState({ tableLoading: false });
                    this.fetch();
                    message.success('删除成功！')
                } else {
                    message.error(data.msg, 4)
                    this.mounted && this.setState({ tableLoading: false });
                }
            })
            .catch(err => {
                message.error(err.message)
                this.mounted && this.setState({ tableLoading: false });
            })
    }

    //发布
    handleRelease = id =>{
        this.mounted && this.setState({ tableLoading: true });
        request.post(`/companyType/deleteCompanyTypeInfo?uuid=${id}`, {
        })
            .then(({data}) => {
                if (data.code === 200) {
                    this.mounted && this.setState({ tableLoading: false });
                    this.fetch();
                    message.success('发布成功！')
                } else {
                    message.error(data.msg, 4)
                    this.mounted && this.setState({ tableLoading: false });
                }
            })
            .catch(err => {
                message.error(err.message)
                this.mounted && this.setState({ tableLoading: false });
            })
    }

    //撤销
    handleUndo = id =>{
        this.mounted && this.setState({ tableLoading: true });
        request.post(`/companyType/deleteCompanyTypeInfo?uuid=${id}`, {
        })
            .then(({data}) => {
                if (data.code === 200) {
                    this.mounted && this.setState({ tableLoading: false });
                    this.fetch();
                    message.success('撤销成功！')
                } else {
                    message.error(data.msg, 4)
                    this.mounted && this.setState({ tableLoading: false });
                }
            })
            .catch(err => {
                message.error(err.message)
                this.mounted && this.setState({ tableLoading: false });
            })
    }

    refreshCurdTable = ()=>{
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

                title: '公告标题',
                dataIndex: 'gysUserName',
            },{
                title: '公告日期',
                dataIndex: 'xyjUserName',
            },{
                title: '状态',
                dataIndex: 'enabled',
                render: (text, record) => {
                    let txt = '';
                    switch (parseInt(record.enabled,0)){
                        case 1:
                            txt = <Badge count={'已发布'} style={{ backgroundColor: '#87d068' }} />;
                            break;
                        case 2:
                            txt = <Badge count={'待发布'} style={{backgroundColor: '#ffbf00'}} />;
                            break;
                        default:
                            break;
                    }
                    return txt;
                },
            },{
                title: '发布类型',
                dataIndex: 'pytUserName',

            },{
                title: '版本号',
                dataIndex: 'gylUserName',
            },{
                title: '发布日期',
                dataIndex: 'uuid',
            },{
                title: '操作',
                dataIndex: '5',
                className:"textc",
                render: (text, record) => {
                    return(
                        <div>
                            <a onClick={()=>this.handleAssociationClass('look', record)} style={{color:'#333',marginRight:'10px',fontSize: 14 }}>
                                <Icon title="查看公告详情" type="search" />
                            </a>
                            <a onClick={()=> {
                                confirm({
                                    title: '提示',
                                    content: '确定要撤销吗？',
                                    onOk: () => this.handleUndo(record.uuid),
                                    onCancel() { },
                                });
                            }} style={{marginRight:'10px',fontSize: 14 }}><Icon title="撤销公告" type="rollback" /></a>
                            <a onClick={()=> {
                                confirm({
                                    title: '提示',
                                    content: '确定发布喜盈佳云平台版本更新公告？',
                                    onOk: () => this.handleRelease(record.uuid),
                                    onCancel() {
                                    },
                                });
                            }} style={{marginRight:'10px',fontSize: 14 }}><Icon title="发布公告" type="arrow-up" /></a>
                            <a onClick={()=>this.showModal('edit', record)}
                               style={{marginRight:'10px',fontSize: 14 }}><Icon title="编辑公告" type="edit" /></a>
                            <a onClick={()=> {
                                confirm({
                                    title: '提示',
                                    content: '确定要删除吗？',
                                    onOk: () => this.handleDelect(record.uuid),
                                    onCancel() { },
                                });
                            }} style={{color:'red',fontSize: 14 }}>
                                <Icon title="删除公告" type="delete" />
                            </a>
                        </div>
                    )



                },
            }
        ];

        return (
            <div>
                <Row className="title" style={{marginTop:20}}>
                    <Col span={24}>
                        <h2>用户信息维护查询</h2>
                    </Col>
                </Row>
                <div className="resultWrap">
                    <div className="table-operations">
                        <Button
                            type="primary"
                            onClick={()=>this.showModal('create')}
                        >
                            新增公告
                        </Button>
                    </div>

                    <Table columns={columns}
                           key={this.state.tableKeyDate}
                           rowKey={record => record.uuid}
                           dataSource={this.state.data}
                           pagination={this.state.pagination}
                           loading={this.state.tableLoading}
                           onChange={this.handleTableChange}
                    />
                </div>

                <EditAddModel
                    key={this.state.editAddKey}
                    modalType={this.state.type}
                    changeVisable={ status =>{
                        this.setState({
                            editAddVisible:status,
                            editAddKey:Date.now()
                        })
                    }}
                    defaultValueDate= {this.state.defaultValueDate}
                    refreshCurdTable={this.refreshCurdTable.bind(this)}
                    visible={this.state.editAddVisible}
                />
            </div>
        );
    }
}

export default Result

