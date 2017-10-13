/**
 * author       : liuliyuan
 * createTime   : 2017/10/13 11:06
 * description  :
 */
import React,{Component} from 'react';
import { Modal, Button } from 'antd';

class NoviceGuide extends Component{
    constructor(props){
        super(props)
        this.state = {
            visible: props.modalVisible,
            modelClassModalKey:Date.now(),

            current: 0,
            steps : [{
                        title: 'First',
                        content: 'First-content',
                    }, {
                        title: 'Second',
                        content: 'Second-content',
                    }, {
                        title: 'Last',
                        content: 'Last-content',
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

    mounted = true;

    componentWillUnmount(){
        this.mounted = null;
    }

    render() {
        const { current,steps } = this.state;
        return (
            <div>
                <Modal
                    key={this.state.modelClassModalKey}
                    title="新手指引"
                    wrapClassName="vertical-center-modal"
                    maskClosable={false}
                    visible={this.state.visible}
                    onCancel={() => this.props.setModalVisible(false)}
                    footer={null}
                >
                    <div>
                        <div className="steps-content">{steps[current].content}</div>
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