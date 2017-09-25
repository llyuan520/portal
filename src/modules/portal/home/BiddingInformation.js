/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 10:46
 * description  :
 */
import React,{Component} from 'react';
import { Button,Table } from 'antd';
import {request} from '../../../utils'

const columns = [{
    title: '公告标题',
    dataIndex: 'title',
    render:(text,record)=> <h2>{record.title}</h2>
}, {
    title: '发布日期',
    dataIndex: 'createTime',
    sorter: true,
},{
    key:'3',
    render:(text,record)=> <a href={record.requestURL} target="_blank"><Button type="btncff9932">了解详情</Button></a>
}];

class BiddingInformation extends Component{

    constructor(props) {
        super(props)
        this.state = {

            companyId: props.companyId,

            data: [],
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: 1,
                pageSize: 5,
                showTotal: (total, range) => `总数: ${total} 条`
            },
            biddingloading: false,
            tableKeyDate: Date.now(),
        }

    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.results = pager.pageSize = pagination.pageSize;
        this.setState({
            pagination: pager,
        });
        //设置去掉排序默认设置的值
        let sor = sorter.order ? sorter.order.replace('end', '') : undefined;
        this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sor,
            ...filters,

        });
    }

    fetch = (params = {}) => {
        //console.log('params:', params);
        this.setState({ biddingloading: true });
        //根据参数查询融资申请信息
        request.get('/indexMessageOutline/queryBizBids',{
            params:{
                results: 5,
                ...params,
            }
        }).then(({data}) => {
            console.log(data.data);

            if(data.code===200) {
                const pagination = {...this.state.pagination};
                // Read total count from server
                pagination.total = data.data.total;
                this.setState({
                    data: [...data.data.list],
                    biddingloading: false,
                    pagination,
                });
            }
        });
    }

    componentDidMount() {
        this.fetch();
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.companyId !== this.state.companyId){
            this.fetch();
        }
    }

    render(){
        return(

            <div className="p-table-body">

                <Table columns={columns}
                       key={this.state.tableKeyDate}
                       rowKey={record => record.uuid}
                       dataSource={this.state.data}
                       pagination={this.state.pagination}
                       loading={this.state.biddingloading}
                       onChange={this.handleTableChange}
                />

            </div>
        )
    }
}

export default BiddingInformation