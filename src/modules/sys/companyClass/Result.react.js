/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:30
 * description  :
 */
import React,{Component} from 'react';
import {Table,Row,Col,Icon,Modal,Card,message} from 'antd';
import {request} from 'utils';
import TreeList from './TreeList'
import EditAddWithClass from './ModelClass'

const confirm = Modal.confirm;

class Result extends Component {
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
            parentId:'',
            tableLoading: false,
            tableKeyDate: Date.now(),

            selectedRowKeys: [],  // Check here to configure the default column
            loading: false,

            editClassVisible: false,
            defaultValue: {},
            editClassKey:Date.now()+'1',

            refKeyDate:Date.now()+'2',
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
            parentId:this.state.parentId,

        });
    }

    fetch = (params = {}) => {
        this.mounted && this.setState({ tableLoading: true });
        //根据参数查询融资申请信息
        request.get('/companyType/queryCompanyTypeList',{
            params:{
                results: 10,
                ...params,
            }
        }).then(({data}) => {
            //console.log(data);
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

    //选中多少条数据
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.mounted && this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }

    //TODO:列表项是否可选择
   /* onSelectChange = (selectedRowKeys) => {
        this.mounted && this.setState({ selectedRowKeys });
    }*/

    //弹出框
    showModal = data =>{
        this.mounted && this.setState({
            editClassVisible: true,
            defaultValue:data
        });
    }

    handleDelect = id =>{
        this.mounted && this.setState({ tableLoading: true });
        request.post(`/companyType/deleteCompanyTypeInfo?uuid=${id}`, {
        })
            .then(({data}) => {
                if (data.code === 200) {
                    this.mounted && this.setState({ tableLoading: false });
                    this.props.refreshCurdTableTree()
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

    getKeyVal = params =>{

        const pager = { ...this.state.pagination };
        pager.current = 1;
        pager.results = 10;
        this.mounted && this.setState({
            pagination: pager,
            parentId: params.parentId
        });

        this.mounted && this.fetch({
            results: pager.pageSize,
            page: pager.current,
            ...params
        });

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
            this.mounted && this.setState({
                pagination: currentPager,
                tableKeyDate: nextProps.filters.lastUpdated,
            });
            this.mounted && this.fetch({
                ...nextProps.filters.values
            })
        }
    }

    render() {

        //跳转到详情页
        const columns = [
            {
                title: '分类代码',
                dataIndex: 'id',
            }, {
                title: '分类名称',
                dataIndex: 'name',
            }, {
                title: '分类来源',
                dataIndex: 'sourceType',
            }, {
                title: '分类关键字',
                dataIndex: 'keywords',
            }, {
                title: '分类描述',
                dataIndex: 'remark',
            }, {
                title: '操作',
                dataIndex: '6',
                className:"textc",
                render: (text, record) => {
                    return(
                        <div>
                            <a onClick={(uuid)=>this.showModal(record)} style={{color:'#333',fontSize: 14,marginRight:10}} >
                                <Icon title="编辑分类" type="edit" />
                            </a>
                            <a onClick={()=> {
                                confirm({
                                    title: '提示',
                                    content: '确定要删除吗',
                                    onOk: () => this.handleDelect(record.id),
                                    onCancel() { },
                                });
                            }} style={{color:'red',fontSize: 14}}>
                                <Icon title="删除" type="delete" />
                            </a>
                        </div>
                    )



                },
            }
        ];
        //TODO:列表项是否可选择
        /*const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };*/

        return (
            <div>
                <Row className="title">
                    <Col span={24}>
                        <h2>公司分类维护查询</h2>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={6} className="resultWrap">
                        <Card noHovering>
                            <TreeList getKeyVal={this.getKeyVal.bind(this)}  refreshCurdTableTree={this.props.refreshCurdTableTree} />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <div className="resultWrap">
                            <Table columns={columns}
                                //rowSelection={rowSelection}  //TODO: 列表项是否可选择
                                   key={this.state.tableKeyDate}
                                   rowKey={record => record.id}
                                   dataSource={this.state.data}
                                   pagination={this.state.pagination}
                                   loading={this.state.tableLoading}
                                   onChange={this.handleTableChange}
                            />
                        </div>
                    </Col>
                </Row>

                <EditAddWithClass
                    key={this.state.editClassKey}
                    modalType="edit"
                    defaultValue={this.state.defaultValue}
                    changeVisable={ status =>{
                        this.setState({
                            editClassVisible:status,
                            editClassKey:Date.now()
                        })
                    }}
                    refreshCurdTableTree={this.props.refreshCurdTableTree}
                    visible={this.state.editClassVisible} />
            </div>
        );
    }
}

export default Result