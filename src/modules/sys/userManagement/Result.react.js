/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:30
 * description  :
 */
import React,{PureComponent} from 'react';
import {Table,Row,Col,Badge,Icon,Button} from 'antd';
import {request} from '../../../utils';
import EditAddModel from './EditAddModel'

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
            disabledLoading: false,
            enabledLoading: false,

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

    //选中多少条数据 - 禁用
    handleDisabled = () => {
        this.setState({
            disabledLoading: true
        });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                disabledLoading: false
            });
        }, 1000);
    }

    //选中多少条数据 - 启用
    handleEnabled = () => {
        this.setState({
            enabledLoading: true
        });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                enabledLoading: false
            });
        }, 1000);
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    //弹出框
    showModal = (type,record) =>{
        this.setState({
            editAddVisible: true,
            type: type,
            defaultValueDate:record,
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
                title: '状态',
                dataIndex: 'typeStatus',
                render: (text, record) => {
                    let txt = '';
                    switch (record.typeStatus){
                        case '1':
                            txt = <Badge count={'正常'} style={{ backgroundColor: '#87d068' }} />;
                            break;
                        case'-1':
                            txt = <Badge count={'已禁用'} />;
                            break;
                        default:
                            break;
                    }
                    return txt;
                },
            },{
                title: '喜盈佳账号',
                dataIndex: 'xyjUserName',
            },{
                title: '票易通账号',
                dataIndex: 'pytUserName',
            },{
                title: '供应商门户账号',
                dataIndex: 'gysUserName',
            },{
                title: '供应链金融账号',
                dataIndex: 'gylUserName',
            },{
                title: '操作',
                dataIndex: '5',
                className:"textc",
                render: (text, record) => {
                    return(
                        <div>
                            <Icon onClick={()=>this.showModal('edit',record)} type="edit" />
                        </div>
                    )



                },
            }
        ];

        const { disabledLoading,enabledLoading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div>
                <Row className="title" style={{marginTop:20}}>
                    <Col span={24}>
                        <h2>供应商分类维护查询</h2>
                    </Col>
                </Row>
                <div className="resultWrap">
                    <div className="table-operations">
                        <Button
                            type="primary"
                            onClick={()=>this.showModal('create')}
                        >
                            新增
                        </Button>
                        <Button onClick={this.handleDisabled}
                                disabled={!hasSelected}
                                loading={disabledLoading}>
                            禁用
                        </Button>
                        <Button onClick={this.handleEnabled}
                                disabled={!hasSelected}
                                loading={enabledLoading}>
                            启用
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

