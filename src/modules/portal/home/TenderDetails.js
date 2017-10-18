/**
 * author       : liuliyuan
 * createTime   : 2017/10/16 15:47
 * description  :
 */
import React,{Component} from 'react'
import { Button,Spin} from 'antd';
import {request} from '../../../utils'

class TenderDetails extends Component{

    state = {
        loading:false,
        conexnt:('<div class="articles-detail-common-detail">' +
            '    <h3 class="title">2017能源管理设备集中采购招标</h3>' +
            '    <h5 class="info">' +
            '      <span>发布时间：2017-08-14 20:52:00</span>' +
            '    </h5>' +
            '    <div class="aticles-content">' +
            '      <p>    招标公司:        采筑电商平台&nbsp;</p><p>&nbsp;   <br>项目地点:        广深区域：深圳、惠州、广州、东莞、佛山、中山、珠海、长沙、厦门、福州、莆田、海口、三亚；  上海区域：上海、南通、嘉兴、嘉定、苏州、昆山、无锡、杭州、温州、南京、镇江、宁波、南昌、合肥、芜湖、扬州；  北京区域：北京、天津、沈阳、鞍山、抚顺、大连、长春、青岛、烟台、唐山、太原、秦皇岛、济南；  成都区域：成都、武汉、重庆、西安、昆明、贵阳、乌鲁木齐、郑州；  采购需求项目分布包含但不限于上述城市；&nbsp;</p><p>&nbsp;   <br>联 系 人:        总部联系人：刘继忠（总部0755-22198165；liujz@vanke.com）&nbsp;</p><p>&nbsp;各项目经办人：&nbsp;<br>        序号            项目            产品合伙人            联系邮箱            联系电话       <br>        1            能源管理设备            田博            tianb03@vanke.com            15994700091&nbsp;</p><p>&nbsp;       <br>招标描述:        本次招标为采筑电商平台能源管理设备集中采购，包含万科集团及其他合伙企业上述项目集团集中采购。  招标一旦中标除将同时中标万科集团及合伙企业的项目外还将作为采筑平台卖家通过平台对外拓展销售业务；&nbsp;</p><p>&nbsp;报名要求：  1、所处行业排名前20；&nbsp;</p><p>&nbsp;2、有大型房地产集团战略合作经验；&nbsp;</p><p>&nbsp;3、协会或权威网站排名前十品牌优先；&nbsp;</p><p>&nbsp;4、在全国范围内有齐全的销售服务网络能够覆盖项目所在城市；&nbsp;</p><p>&nbsp;5、定位为主流品牌；&nbsp;</p><p>&nbsp;   <br>发布时间:        2017-7-9   <br>    截止时间:        2017-7-31   <br><br></p>' +
            '    </div>' +
            '  </div>')
    }

    fetch = () => {
        console.log(this.props.match.params.id);
        this.mounted && this.setState({ loading: true });
        this.mounted && this.setState({ loading: false });
        //根据参数查询融资申请信息
        /*request.get(`/indexMessageOutline/queryBizBids/${this.props.match.params.id}`,{
        }).then(({data}) => {
            if(data.code===200) {
                this.mounted && this.setState({
                    data: [...data.data.list],
                    loading: false,
                });
            }
        });*/
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

        return(
            <div style={{background: '#fff'}}>
                <div className="mediaWidth2" style={{padding:'40px 20px'}}>
                   {/* <h1  style={{textAlign: 'center',marginBottom:'20px'}}>2017能源管理设备集中采购招标</h1>*/}

                    <Spin spinning={this.state.loading}>
                        <div dangerouslySetInnerHTML={{  __html: this.state.conexnt }} />
                    </Spin>

                    <div style={{textAlign: 'center',marginTop:'20px'}}>
                        <a
                            //href={record.requestURL}
                            onClick={()=>{

                                //TODO: 添加piwik点击事件跟踪
                               // piwik.push(['trackEvent', `${record.title}`, '了解详情']);
                                //window.open(record.requestURL);
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