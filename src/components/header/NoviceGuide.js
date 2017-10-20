/**
 * author       : liuliyuan
 * createTime   : 2017/10/13 11:06
 * description  :
 */
import React,{Component} from 'react';
import { Modal, Button } from 'antd';

import img1 from './images/1.png';
import img2 from './images/2.png';
import img3 from './images/3.png';
import img4 from './images/4.png';
import img5 from './images/5.png';

class NoviceGuide extends Component{
    constructor(props){
        super(props)
        this.state = {
            visible: props.modalVisible,
            modelClassModalKey:Date.now(),

            current: 0,
            steps : [{
                        title: '供应商门户',
                        content: img1,
                    }, {
                        title: '总门户预览',
                        content: img2,
                    }, {
                        title: '协同开票',
                        content: img3,
                    }, {
                        title: '发票管理',
                        content: img4,
                    }, {
                        title: '招标信息',
                        content: img5,
                    }]
        }
    }

    next() {
        const current = this.state.current + 1;
        this.mounted && this.setState({ current });
    }
    prev() {
        const current = this.state.current - 1;
        this.mounted && this.setState({ current });
    }

    componentDidMount() {

    }

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
        const { current,steps,visible } = this.state;
        return (
            <div>
                <Modal
                    key={this.state.modelClassModalKey}
                    title="新手指引"
                    wrapClassName="vertical-center-modal"
                    maskClosable={false}
                    visible={visible}
                    onCancel={() => this.props.setModalVisible(false)}
                    width="640px"
                    footer={null}
                >
                    <div>
                        <div className="steps-content">
                            <img alt={steps[current].title} src={steps[current].content} />
                        </div>
                        <div className="steps-action" style={{textAlign:'right'}}>
                            {
                                current > 0
                                &&
                                <Button onClick={() => this.prev()}>
                                    上一页
                                </Button>
                            }
                            {
                                current < steps.length - 1
                                &&
                                <Button type="primary" style={{ marginLeft: 8 }}  onClick={() => this.next()}>下一页</Button>
                            }
                            {
                                current === steps.length - 1
                                &&
                                <Button type="primary" style={{ marginLeft: 8 }} onClick={() => this.props.setModalVisible(false)}>关闭</Button>
                            }
                        </div>
                    </div>

                </Modal>
            </div>
        );
    }
}

export default NoviceGuide