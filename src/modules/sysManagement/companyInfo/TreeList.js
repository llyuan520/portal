/**
 * author       : liuliyuan
 * createTime   : 2017/9/29 16:55
 * description  :
 */
import React,{Component} from 'react';
import { Tree,Icon,Button,Spin } from 'antd';
import EditAddWithClass from './ModelClass'
import {request} from '../../../utils';

const TreeNode = Tree.TreeNode;
class TreeList extends Component {
    state = {
        expandedKeys: [],
        autoExpandParent: true,
        selectedKeys: [],

        treeData:[],
        editClassKey:Date.now()+'1',
        eidtLoading:false,
    }
    onExpand = (expandedKeys) => {
        //console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        console.log('selectedKeys', selectedKeys);
        this.setState({ selectedKeys });
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={<span><Icon type="folder-open" style={{ fontSize: 16 }} /> {item.title}</span>}  key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }

    //弹出框
    showModal = () =>{
        this.setState({
            editClassVisible: true
        });
    }

    fetchTree = () => {
        this.mounted && this.setState({ eidtLoading: true });
        request.get('/companyType/queryCompanyTypeTree',{
        }).then(({data}) => {
            //console.log(data);
            if(data.code===200) {
                this.mounted && this.setState({
                    treeData: data.data,
                    eidtLoading: false,
                });
            }
        });
    }

    componentDidMount() {
        this.fetchTree();
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

        //console.log(nextProps);

    }

    render() {
        const { expandedKeys,autoExpandParent,selectedKeys } = this.state;
        const hasSelected = selectedKeys.length > 0;
        return (
            <div>

                <Spin spinning={this.state.eidtLoading}>

                    <div style={{marginBottom:20}}>
                        <Button type="primary"
                                disabled={!hasSelected}
                                onClick={()=>this.showModal()}
                        >新增分类</Button>
                    </div>

                    <Tree
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        onSelect={this.onSelect}
                        selectedKeys={selectedKeys}
                    >
                        {this.renderTreeNodes(this.state.treeData)}
                    </Tree>
                </Spin>
                <EditAddWithClass
                    key={this.state.editClassKey}
                    modalType="create"
                    changeVisable={ status =>{
                        this.setState({
                            editClassVisible:status,
                            editClassKey:Date.now()
                        })
                    }}
                    selectedKeys={selectedKeys[0]}
                    fetchTree={this.fetchTree.bind(this)}
                    visible={this.state.editClassVisible} />
            </div>

        );
    }
}

export default  TreeList



