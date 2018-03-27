import React,{Component} from 'react';
import {message,Upload,Button,Icon} from 'antd';
import PropTypes from 'prop-types'
import oauth from '../../oAuth';


class AutoFileUpload extends Component{
    static propTypes={
        title:PropTypes.string.isRequired,
    }

    onChange=info=>{
        if (info.file.status === 'uploading') {
            console.log('uploading');
        }
        if (info.file.status === 'done') {
            if(info.file.response.code===200){
                message.success(`${info.file.name} 上传成功`);
                this.props.onSuccess()
            }else {
                message.error(info.file.response.msg);
            }
        }
        if(info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败 :${info.file.response.msg}`);
        }
    }
    //不设置accept的原因是设置之后osx下弹出文件选择会特别慢
    getUpLoadProps = () => ({
        name: 'files',
        action:`${window.baseURL+this.props.url}`,
        headers: {
            Authorization:oauth.getToken(),
        },
        showUploadList:false
    });
    render(){
        return(
            <div style={{display:'inline-block',marginRight:5}}>
                    <Upload {...this.getUpLoadProps(this.props)} onChange={this.onChange.bind(this)}>
                            <Button style={{marginTop:10}}>
                                <Icon type="upload" /> {this.props.title}
                            </Button>
                    </Upload>
            </div>
        )
    }
}

export default AutoFileUpload