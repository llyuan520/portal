/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:30
 * description  :
 */
import React,{PureComponent} from 'react';
import {Table,Row,Col,Badge,Icon,Button,message,Switch} from 'antd';
import {request} from '../../../utils';
import {AutoFileUpload,FileExport} from '../../../components'
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
    handleChange = (checked,uuid) => {
        const param = {
            enabled:checked === true ? '1' : '2',
            userId: uuid,
        }
        request.post('/userManage/modifyUserStatus', {...param})
            .then(({data}) => {
                if (data.code === 200) {
                    message.success('修改状态成功！', 4)
                    //新增成功，关闭当前窗口,刷新父级组件
                    this.fetch();
                } else {
                    message.error(data.msg, 4)
                }
            })
            .catch(err => {
                message.error(err.message)
            })

    }

    onSelectChange = (selectedRowKeys) => {
        this.mounted && this.setState({ selectedRowKeys });
    }

    //弹出框
    showModal = (type,record) =>{
        this.mounted && this.setState({
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
                title: '公司名称',
                dataIndex: 'companyName',
            },{
                title: '公司代码',
                dataIndex: 'companyCode',
            },{
                title: '创建时间',
                dataIndex: 'createdDate',
            },{
                title: '供应商门户账号',
                dataIndex: 'gysUserName',
            },{
                title: '喜盈佳账号',
                dataIndex: 'xyjUserName',
            },{
                title: '票易通账号',
                dataIndex: 'pytUserName',
           /* },{
                title: '供应链金融账号',
                dataIndex: 'gylUserName',*/
            },{
                title: '状态',
                dataIndex: 'enabled',
                render: (text, record) => {
                    let txt = '';
                    switch (parseInt(record.enabled,0)){
                        case 1:
                            txt = <Badge count={'可用'} style={{ backgroundColor: '#87d068' }} />;
                            break;
                        case 2:
                            txt = <Badge count={'禁用'} />;
                            break;
                        case 3:
                            txt = <Badge count={'删除'} />;
                            break;
                        default:
                            break;
                    }
                    return txt;
                },
            },{
                title: '操作',
                dataIndex: '5',
                className:"textc",
                render: (text, record) => {
                    return(
                        <div>
                            <a onClick={()=>this.showModal('edit',record)} style={{color:'#333',fontSize: 14,marginRight:'10px'}}><Icon title="编辑" type="edit" /></a>

                                {/*TODO: 传值的几种写法
                                onChange={(record=>checked=>this.handleChange(checked,record))(record)} 函数 写法
                                onChange={this.handleChange.bind(this,record)} 用bind，this后面加上你要的参数，他会把value值传到你写的方法的最后一个参数上
                                onChange={(checked)=>{this.handleChange(checked,record)}}  显式地把value写出来，这样就可以把value和参数都传过去*/}

                            <Switch checkedChildren="禁用" unCheckedChildren="启用" defaultChecked={parseInt(record.enabled, 0) === 1}  onChange={(checked)=>{this.handleChange(checked,record.uuid)}} />
                        </div>
                    )
                },
            }
        ];

        /*const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;*/

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
                            新增
                        </Button>
                        <AutoFileUpload
                            url={`userManage/upload/company`}
                            title="导入单点登录公司"
                            onSuccess={this.refreshCurdTable}
                        />
                        <AutoFileUpload
                            url={`userManage/upload/user`}
                            title="导入单点登录用户"
                            onSuccess={this.refreshCurdTable}
                        />
                        <FileExport
                            url='userManage/download/company'
                            title="下载导入公司信息模板"
                        />
                        <FileExport
                            url='userManage/download/user'
                            title="下载导入用户模板"
                        />
                        <FileExport
                            url={`userManage/export`}
                            title="导出"
                            params={this.props.filters}
                            setButtonStyle={{marginRight:5}}
                        />
                    </div>

                    <Table columns={columns}
                           //rowSelection={rowSelection}
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

