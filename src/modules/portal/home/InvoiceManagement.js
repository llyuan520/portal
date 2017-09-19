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
            companyId: props.companyId,
            refLoading: false,
        }

    }

    fetch = companyId => {

        this.mounted && this.setState({ refLoading: true });
        request.get(`/get/${companyId}`, {

        }).then(({data}) => {

            setTimeout(() => {
                this.mounted && this.setState({
                    refLoading: false,
                });
            }, 3000);

            /*if (data.code === 200) {
                this.mounted && this.setState({
                    companyInfoData: {...data.data},
                    refLoading: false,
                });
            }*/

        });
    }

    componentDidMount() {

        this.fetch(this.state.companyId);

    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.companyId !== this.state.companyId){
            this.fetch(nextProps.companyId);
        }
    }

    render(){
        return(
            <Spin size='small' spinning={this.state.refLoading}>
               <div className="p-invoice-main">
                    <Card noHovering  bordered={true} className="p-invoice-list">
                        <Link to="/home">
                            <img src={xxfp} alt="xxfp" />
                        </Link>
                        <h2>销项发票管理</h2>
                        <p>管理已开具的增值税发票</p>
                    </Card>
                    <Card noHovering  bordered={true} className="p-invoice-list">
                        <Link to="/home">
                            <img src={xxfp} alt="xxfp" />
                        </Link>
                        <h2>销项发票管理</h2>
                        <p>管理已开具的增值税发票</p>
                    </Card>
                    <Card noHovering  bordered={true} className="p-invoice-list">
                        <Link to="/home">
                            <img src={xxfp} alt="xxfp" />
                        </Link>
                        <h2>进项发票管理</h2>
                        <p>管理已开具的增值税发票</p>
                    </Card>
                    <Card noHovering  bordered={true} className="p-invoice-list">
                        <Link to="/home">
                            <img src={xxfp} alt="xxfp" />
                        </Link>
                        <h2>销项发票管理</h2>
                        <p>管理已开具的增值税发票</p>
                    </Card>
                </div>
            </Spin>
        )
    }

}

export default InvoiceManagement