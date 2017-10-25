/**
 * author       : liuliyuan
 * createTime   : 2017/10/25 17:22
 * description  :
 */
import React,{ Component } from 'react';
import {Icon} from 'antd';
import {messageInfo} from "../../config/index";


let timer = null;
class StartMarquee extends Component {

    state={
        speed: 1500,
    }

    marquee=()=>{
        let element=document.getElementById("hotNews"),
            element1=document.getElementById("hotNews1");

        if(element1.offsetHeight - element.scrollTop <= 0) {
            element.scrollTop -= element1.offsetHeight;
        } else{
            element.scrollTop++
        }

        if (parseInt(element.scrollTop, 0) % 22 !== 0) {
            timer = setTimeout(()=>{this.marquee()}, 20); //后面的值如果设置成一样的是连续无痕滚动 如果有间隔就是一个一个弹出
        } else {
            timer = setTimeout(()=>{this.marquee()}, this.state.speed);
        }
    }

    handelOnMouserOver=()=>{
        clearTimeout(timer)
    }

    handelOnMouseOut=()=> {
        timer = setTimeout(()=>{this.marquee()}, this.state.speed);
    }


    componentDidMount(){
        //获取滚动部分
        let element1=document.getElementById("hotNews1"),
            element2=document.getElementById("hotNews2");

        element2.innerHTML += element1.innerHTML;
        clearTimeout(timer);
        timer = setTimeout(()=>{this.marquee()}, this.state.speed);
    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps) {

    }

    render(){
        return(
            <div className="hide">
                <Icon type="sound" style={{ position: 'absolute',fontSize: 16,color:'#fff',verticalAlign:'middle',marginRight:'10px',top:'24px' }} />
                <div id="hotNews" className="q-hotNews" onMouseOver={this.handelOnMouserOver} onMouseOut={this.handelOnMouseOut}>
                    <ul id="hotNews1">
                        {
                            messageInfo.map((item,i)=>{
                                return(
                                    <li key={i}>
                                        <a title={item.title} href={item.url} style={{color:'#fff'}}>
                                            {item.title}
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul id="hotNews2">

                    </ul>
                </div>
            </div>
        )

    }
}

export default StartMarquee
