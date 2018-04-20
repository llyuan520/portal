/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 10:46
 * description  :
 */
import React,{Component} from 'react';
import { Button,Table,Icon } from 'antd';
import {Link} from 'react-router-dom';
import {request,piwik} from 'utils'

const columns = [{
    title: '公告标题',
    dataIndex: 'title',
    render:(text,record)=>{
        return <div>
            <h2>
                {record.title}
            </h2>
            <p className="p-time-user">
                <Icon type="calendar" style={{ fontSize: 16}} />截止日期： {record.endTime}
                <Icon type="user" style={{ fontSize: 16,marginLeft:'30px' }} />招标方 ：{record.company}
            </p>
        </div>
    }
}, {
    title: '地区',
    dataIndex: 'area',
}, {
    title: '发布日期',
    dataIndex: 'createTime',
    sorter: true,
},{
    key:'3',
    render:(text,record)=> {
        return(
            <Link to={{
                pathname: `/dashboard/tenderDetails/${record.uuid}`,
            }}
                  target="_blank"
                  onClick={()=>{

                      //TODO: 添加piwik点击事件跟踪
                      piwik.push(['trackEvent', `${record.title}`, '了解详情']);
                  }}
            >
                <Button type="btncff9932">了解详情</Button>
            </Link>
        )
    }
}];

class BiddingInformation extends Component{

    constructor(props) {
        super(props)
        this.state = {

            companyCode: props.companyCode,

            data: [],
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: 1,
                pageSize: 5,
                defaultPageSize:5,
                pageSizeOptions:['5',' 10', '20', '30', '40'],
                showTotal: (total, range) => `总数: ${total} 条`
            },
            loading: false,
            tableKeyDate: Date.now(),
        }

    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.results = pager.pageSize = pagination.pageSize;
        this.mounted && this.setState({
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
        this.mounted && this.setState({ loading: true });
        //根据参数查询融资申请信息
        request.get('/bizBids/queryBizBids',{
            params:{
                results: 5,
                companyCode:this.state.companyCode,
                ...params,
            }
        }).then(({data}) => {
            if(data.code===200) {
                const pagination = {...this.state.pagination};
                // Read total count from server
                pagination.total = data.data.total;
                this.mounted && this.setState({
                    data: [...data.data.list],
                    loading: false,
                    pagination,
                });
            }
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
        if(nextProps.companyCode !== this.state.companyCode){
            this.mounted && this.setState({
                companyCode:nextProps.companyCode
            },()=>{
                this.fetch();
            })

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
                       loading={this.state.loading}
                       onChange={this.handleTableChange}
                />

            </div>
        )
    }
}

export default BiddingInformation