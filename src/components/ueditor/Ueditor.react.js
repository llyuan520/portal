/**
 * author       : liuliyuan
 * createTime   : 2017/11/9 15:17
 * description  :
 */
import React,{Component} from 'react';
import Simditor from 'simditor';
import $ from 'jquery';
import oauth from '../../oAuth'

import 'simditor/styles/simditor.css';

class SimpEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        this.initEditor();
    };

    initEditor = () => {

        let config = {
            placeholder: this.props.placeholder,
            defaultImage: 'images/image.png',
            upload: {
                url: window.baseURL+'announcement/uploadFile', //文件上传的接口地址
                params: {
                    authorization:oauth.getToken(),
                }, //键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
                fileKey: 'files', //服务器端获取文件数据的参数名
                connectionCount: 3,
                leaveConfirm: '正在上传文件',
            },
            success: function(data) {
                alert(data);
            },
            textarea: $(this.refs.textarea)
        };

        this.editor = new Simditor(config);// 初始化编辑器
        this.editor.setValue(this.props.value);

        //监听改变
        this.editor.on("valuechanged", (e, src) => {
            this.props.onChange(this.getValue());
        });

        //更改图片上传类型
        $(".simditor input[type='file']").attr('accept', 'image/jpg,image/jpeg,image/png,image/bmp');
    };

    /*componentWillReceiveProps(nextProps){
        this.editor.setValue(nextProps.value);
    };*/

    componentWillUnmount () {
        this.editor = null;
    }

    getValue = () => {
        // return this.editor.getValue().trim();
        let selectName = `#${this.props.id} .simditor`;
        let html = $(selectName).find(".simditor-body").html();
        console.log(html);
        return html;
    };

    render() {
        return (
            <textarea
                id={this.props.id}
                ref="textarea"/>
        );
    }
}

export default SimpEditor;
