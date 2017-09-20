/**
 * author       : liuliyuan
 * createTime   : 2017/9/19 10:56
 * description  :
 */
import React,{Component} from 'react';
import { Card,Spin} from 'antd';
import {Link} from 'react-router-dom';
import {request} from '../../../utils'
import xxfp from './img/xxfp.png'

class InvoiceManagement extends Component{

    constructor(props){
        super(props)
        this.state= {
            data:[
                {
                    title:'销项发票管理',
                    context:'管理已开具的增值税发票',
                    imgUrl:xxfp,
                    pathUrl:'',
                },{
                    title:'销项发票管理',
                    context:'管理已开具的增值税发票',
                    imgUrl:xxfp,
                    pathUrl:'',
                },{
                    title:'销项发票管理',
                    context:'管理已开具的增值税发票',
                    imgUrl:xxfp,
                    pathUrl:'',
                },{
                    title:'销项发票管理',
                    context:'管理已开具的增值税发票',
                    imgUrl:xxfp,
                    pathUrl:'',
                }
            ],

            companyId: props.companyId,
            refLoading: false,
        }

    }

    fetch = () => {

        this.mounted && this.setState({ refLoading: true });
        request.get(`/link/queryPath`, {

        }).then(({data}) => {

            if (data.code === 200) {

                this.setState((prevState, props) => {
                    const preDate = [...prevState.data];
                    return {
                        data:preDate.map(item=>{
                            item['pathUrl'] = data.data.homePath; //发票管理
                            return item;
                        }),
                        refLoading: false,
                    };
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

        if(nextProps.companyId !== this.state.companyId){
            this.fetch();
        }
    }

    render(){
        return(
            <Spin size='small' spinning={this.state.refLoading}>
               <div className="p-invoice-main">

                   {
                       this.state.data.map((item,i)=>(
                           <Card key={i} noHovering  bordered={true} className="p-invoice-list">
                               <Link to="/home">
                                   <img src={item.imgUrl} alt={item.title} />
                               </Link>
                               <h2>{item.title}</h2>
                               <p>{item.context}</p>
                           </Card>
                       ))
                   }

                </div>
            </Spin>
        )
    }

}

export default InvoiceManagement