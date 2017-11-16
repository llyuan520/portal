/**
 * author       : liuliyuan
 * createTime   : 2017/10/16 15:47
 * description  :
 */
import React,{Component} from 'react'
import { Button,Spin} from 'antd';
import {request,piwik} from '../../../utils'

class TenderDetails extends Component{

    state = {
        loading:false,
        data:{},
    }

    fetch = () => {
        this.mounted && this.setState({ loading: true });
        //根据参数查询融资申请信息
        request.get(`/bizBids/queryBizBid/${this.props.match.params.id}`,{
        }).then(({data}) => {
            if(data.code===200) {
                this.mounted && this.setState({
                    data: {...data.data},
                    loading: false,
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


    }


    render(){

        const item  = this.state.data;

        return(
            <div style={{background: '#fff'}}>
                <div className="mediaWidth2" style={{padding:'40px 20px'}}>
                    <Spin spinning={this.state.loading}>
                        <div style={{minHeight:'400px'}} dangerouslySetInnerHTML={{  __html: item.content }} />
                    </Spin>

                    <div style={{textAlign: 'center',marginTop:'20px'}}>
                        <a
                            href={item.requestURL}
                            onClick={()=>{

                                //TODO: 添加piwik点击事件跟踪
                                piwik.push(['trackEvent', `${item.title}`, '了解详情']);
                               // window.open(item.requestURL);
                            }}
                            target="_blank">
                            <Button type="primary" style={{ width: 180,height: 40}}>去投标</Button>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default TenderDetails