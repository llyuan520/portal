/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 10:46
 * description  :
 */
import React,{Component} from 'react';
import { Icon,Button,Table } from 'antd';
import {Link} from 'react-router-dom';
import {request} from '../../../utils'

const columns = [{
    title: '公告标题',
    dataIndex: 'name',
    sorter: true,
    render:(text,record)=>{
        return <div>
            <h2>
                {record.name.title} - 水务集团2017、2018年度PPR管材及管件采购入围项目
            </h2>
            <p className="p-time-user">
                <Icon type="calendar" style={{ fontSize: 16}} />截止日期： {record.dob}
                <Icon type="user" style={{ fontSize: 16,marginLeft:'30px' }} />招标方 ：陕西雄峰钢构装饰工程有限公司
            </p>
        </div>
    }
}, {
    title: '地区',
    dataIndex: 'gender',
}, {
    title: '发布日期',
    dataIndex: 'email',
},{
    key:'5',
    render:(text,record)=>{
        return <div>
            <Link to={`/home/${record.uuid}`}><Button type="primary">了解详情</Button></Link>
        </div>
    }
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
        request.get('https://randomuser.me/api',{
            params:{
                results: 5,
                ...params,

            }
        }).then(({data}) => {
            //console.log(data.data);
           // if(data.code===200) {
                const pagination = {...this.state.pagination};
                // Read total count from server
                //pagination.total = data.data.total;
                 //pagination.total = data.totalCount;
                pagination.total = 200;
                this.setState({
                    //data: [...data.data.list],
                    data:data.results,
                    biddingloading: false,
                    pagination,
                });
            //}
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
                       rowKey={record => record.registered}
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