/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:30
 * description  :
 */
import React,{PureComponent} from 'react';
import {Table,Row,Col,Badge,Icon,Button,message,Modal } from 'antd';
import {request,htmlDecode} from 'utils';
import EditAddModel from './EditAddModel'
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

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

            detailsVisible: false,
            detailsKey:Date.now(),
            modalInfo:{}
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
        request.get('/announcement/queryPage',{
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

    onSelectChange = (selectedRowKeys) => {
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
        request.post(`/announcement/delete/${id}`, {
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
        request.post(`/announcement/updateStatus/${id}/20`, {
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
        request.post(`/announcement/updateStatus/${id}/10`, {
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


    handleOk = (e) => {
        this.setState({
            detailsVisible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            detailsVisible: false,
        });
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
                dataIndex: 'title',
            }, {
                title: '公告日期',
                dataIndex: 'announcementDate',
            }, {
                title: '公告类型',
                dataIndex: 'announcementType',
                render: (text, record) => {
                    let txt = '';
                    switch (parseInt(record.announcementType,0)){
                        case 10:
                            txt = '普通公告';
                            break;
                        case 20:
                            txt = '重要公告';
                            break;
                        default:
                            break;
                    }
                    return txt;
                },
            },{
                title: '状态',
                dataIndex: 'status ',
                render: (text, record) => {
                    let txt = '';
                    switch (parseInt(record.status,0)){
                        case 20:
                            txt = <Badge count={'已发布'} style={{ backgroundColor: '#87d068' }} />;
                            break;
                        case 10:
                            txt = <Badge count={'待发布'} style={{backgroundColor: '#ffbf00'}} />;
                            break;
                        default:
                            break;
                    }
                    return txt;
                },
            },{
                title: '发布类型',
                dataIndex: 'type ',
                render: (text, record)=>{
                    let txt = '';
                    switch (parseInt(record.type,0)){
                        case 20:
                            txt = '系统定时发布';
                            break;
                        case 10:
                            txt = '手工发布';
                            break;
                        default:
                            break;
                    }
                    return txt;
                }

            },{
                title: '发布对象',
                dataIndex: 'rangeType',
                render: (text, record) => {
                    let txt = '';
                    switch (parseInt(record.rangeType,0)){
                        case 10:
                            txt = '所有用户';
                            break;
                        case 20:
                            txt = '指定公司';
                            break;
                        case 30:
                            txt = '指定用户';
                            break;
                        default:
                            break;
                    }
                    return txt;
                },
            },{
                title: '版本号',
                dataIndex: 'version',
            },{
                title: '发布日期',
                dataIndex: 'publishTime',
            },{
                title: '操作',
                dataIndex: '5',
                className:"textc",
                render: (text, record) => {
                    let txt = '';
                    switch (parseInt(record.status,0)){
                        case 20:
                            txt = (
                                <div>
                                    <a onClick={()=>{
                                        this.setState({
                                            modalInfo:record,
                                            detailsVisible: true,
                                        })
                                    }} style={{color:'#333',marginRight:'10px',fontSize: 14 }}>
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
                                </div>
                            );
                            break;
                        case 10:
                            txt = (
                                <div>
                                    <a onClick={()=>{
                                        this.setState({
                                            modalInfo:record,
                                            detailsVisible: true,
                                        })
                                    }} style={{color:'#333',marginRight:'10px',fontSize: 14 }}>
                                        <Icon title="查看公告详情" type="search" />
                                    </a>
                                    <a onClick={()=> {
                                        confirm({
                                            title: '提示',
                                            content: '确定发布喜盈佳云平台版本更新公告？',
                                            onOk: () => this.handleRelease(record.uuid),
                                            onCancel() {
                                            },
                                        });
                                    }} style={{marginRight:'10px',fontSize: 14 }}><Icon title="发布公告" type="arrow-up" /></a>
                                    <a onClick={()=>this.showModal('edit', {
                                            ...record, type:parseInt(record.type,0) === 20
                                        }
                                    )}
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
                            );
                            break;
                        default:
                            break;
                    }

                    return txt;
                },
            }
        ];

        const modalInfo = this.state.modalInfo;
        return (
            <div>
                <Row className="title">
                    <Col span={24}>
                        <h2>公告信息维护查询</h2>
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
                            editAddKey:Date.now()+2
                        })
                    }}
                    defaultValueDate= {this.state.defaultValueDate}
                    refreshCurdTable={this.refreshCurdTable.bind(this)}
                    visible={this.state.editAddVisible}
                />

                <Modal
                    title='查看详情'
                    key={this.state.detailsKey}
                    visible={this.state.detailsVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width="760px"
                >
                    <Row>

                        <h1 style={{textAlign:'center',marginBottom:'10px'}}>{modalInfo.title}</h1>

                        <p style={{marginBottom:'10px'}}>公告日期：{modalInfo.announcementDate}</p>

                        <p style={{marginBottom:'30px'}}>版本号：{modalInfo.version}</p>

                        <p style={{marginBottom:'10px'}}>本次更新内容：</p>

                        <div style={{marginBottom:'10px'}} dangerouslySetInnerHTML={{  __html: htmlDecode(modalInfo.content) }}></div>

                        <p style={{textAlign:'right',marginBottom:'10px'}}>
                            ——喜盈佳产品团队
                        </p>

                    </Row>

                </Modal>

            </div>
        );
    }
}

export default Result
