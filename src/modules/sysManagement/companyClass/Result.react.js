/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:30
 * description  :
 */
import React,{PureComponent} from 'react';
import {Table,Row,Col,Badge,Icon,Button,Modal,Tree,Input} from 'antd';
import {request} from '../../../utils';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

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
            loading: false,

            editClassVisible: false,
            uuid: '',
            editClassKey:Date.now()+'1',
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

    //选中多少条数据
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    //弹出框
    showModal = uuid =>{
        this.setState({
            editClassVisible: true,
            uuid:uuid
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

        console.log(nextProps.filters);


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
                    switch (record.typeStatus){
                        case '1':
                            txt = <Badge count={'已分类'} style={{ backgroundColor: '#87d068' }} />;
                            break;
                        case'-1':
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
                title: '操作',
                dataIndex: '5',
                className:"textc",
                render: (text, record) => {
                    return(
                        <div>
                            <Icon onClick={(uuid)=>this.showModal(record.uuid)} type="edit" />
                        </div>
                    )



                },
            }
        ];

        const { loading, selectedRowKeys } = this.state;
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
                            onClick={this.start}
                            disabled={!hasSelected}
                            loading={loading}
                        >
                            关联分类
                        </Button>
                        <Button>导出</Button>
                        <Button>导入</Button>
                        <Button>下载导入模板</Button>
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
                    uuid={this.state.uuid}
                    changeVisable={ status =>{
                        this.setState({
                            editClassVisible:status,
                            editClassKey:Date.now()
                        })
                    }}
                    visible={this.state.editClassVisible} />

            </div>
        );
    }
}

export default Result




const treeData = [{
    title: '0-0',
    key: '0-0',
    children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
        ],
    }, {
        title: '0-0-1',
        key: '0-0-1',
        children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
        ],
    }, {
        title: '0-0-2',
        key: '0-0-2',
    }],
}, {
    title: '0-1',
    key: '0-1',
    children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
    ],
}, {
    title: '0-2',
    key: '0-2',
}];

class EditClass extends PureComponent{
    state = {
        expandedKeys: [],
        checkedKeys: [],
        selectedKeys: [],
        searchValue: '',
        autoExpandParent: true,

        dataList : [],
        editClassModalKey:Date.now()+'1',
    }

    handleOk = (e) => {
        console.log(this.props.uuid);
        this.props.changeVisable(false);
    }
    handleCancel = (e) => {
        console.log(this.props.uuid);
        this.props.changeVisable(false);
    }



    generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.key;
            this.state.dataList.push({ key, title: key });
            if (node.children) {
                this.generateList(node.children, node.key);
            }
        }
    };


    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }

    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = this.state.dataList.map((item) => {
            if (item.key.indexOf(value) > -1) {
                return this.getParentKey(item.key, treeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }

    renderTreeNodes = data => {
        return data.map((item) => {
            const index = item.key.indexOf(this.state.searchValue);
            const beforeStr = item.key.substr(0, index);
            const afterStr = item.key.substr(index + this.state.searchValue.length);
            const title = index > -1 ? (
                <span>
              {beforeStr}
                    <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
                    {afterStr}
            </span>
            ) : <span>{item.key}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} />;
        });
    }

    fetch = uuid => {
        //根据参数查询融资申请信息
        request.get(`/companyType/queryCompanyTypeInfo/${uuid}`,{
        }).then(({data}) => {
            console.log(data);
            if(data.code===200) {
                this.generateList(treeData);
            }
        });
    }

    componentDidMount() {
        console.log(this.props.uuid);
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.uuid !== this.props.uuid){
            this.fetch(nextProps.uuid);
        }
        console.log(nextProps)

    }

    render() {

        return (
                <Modal
                    key={this.state.editClassModalKey}
                    title="编辑分类"
                    visible={this.props.visible}
                    okText="保存"
                    cancelText="取消"
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div>
                        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                        <div style={{height:400,overflowY: 'auto'}}>
                            <Tree
                                checkable
                                onExpand={this.onExpand}
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.checkedKeys}
                                onSelect={this.onSelect}
                                selectedKeys={this.state.selectedKeys}
                            >
                                {this.renderTreeNodes(treeData)}
                            </Tree>
                        </div>

                    </div>

                </Modal>
        );
    }
}