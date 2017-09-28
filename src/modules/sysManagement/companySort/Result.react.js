/**
 * author       : liuliyuan
 * createTime   : 2017/9/28 15:30
 * description  :
 */
import React,{PureComponent} from 'react';
import {Table,Row,Col,Badge,Icon,Button} from 'antd';
import {request} from '../../../utils';


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
                    <Icon type="edit" />
                </div>
            )



        },
    }
];

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
            findAssetsLoading: false,
            tableKeyDate: Date.now(),

            selectedRowKeys: [],  // Check here to configure the default column
            loading: false,
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

        this.mounted && this.setState({ findAssetsLoading: true });
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
                    findAssetsLoading: false,
                    pagination,
                });
            }
        });
    }

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
                           loading={this.state.findAssetsLoading}
                           onChange={this.handleTableChange}
                    />
                </div>
            </div>
        );
    }
}

export default Result