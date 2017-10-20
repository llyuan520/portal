/**
 * author       : liuliyuan
 * createTime   : 2017/10/13 10:11
 * description  :
 */
import React,{PureComponent} from 'react';
import {Modal,Tree,Input,Button} from 'antd';
import {request} from '../../../utils';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class EditClass extends PureComponent{
    state = {
        expandedKeys: [],
        checkedKeys:  ['0-0-0'],
        selectedKeys: [],
        searchValue: '',
        autoExpandParent: true,

        dataList : [],

        treeData:[],
        treeLoading:false,
        editClassModalKey:Date.now()+'1',

    }

    static defaultProps={
        modalType:'look'
    }

    handleOk = (e) => {
        console.log(this.props.uuid);
        /*request.post('/companyInfo/updateCompanyInfo', dataInfo)
            .then(({data}) => {
                if (data.code === 200) {
                    message.success('新增分类成功！', 4)
                    //新增成功，关闭当前窗口,刷新父级组件
                    this.props.changeVisable(false)
                    this.props.refreshCurdTableTree();
                } else {
                    message.error(data.msg, 4)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.mounted && this.setState({
                    submitLoading: false
                })
            })*/


        this.props.changeVisable(false);
    }
    handleCancel = (e) => {
        console.log(this.props.uuid);
        this.props.changeVisable(false);
    }



    generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.key;
            this.state.dataList.push({ key, title: key });
            if (node.children) {
                this.generateList(node.children, node.key);
            }
        }
    };


    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck = (checkedKeys,info) => {
        console.log('info', info);
        if(info.checked) {
            const selectedNodes = info.node.props.dataRef;
            console.log('onCheck', selectedNodes);
        }
        this.setState({
            checkedKeys,
        });
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }

    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = this.state.dataList.map((item) => {
            if (item.key.indexOf(value) > -1) {
                return this.getParentKey(item.key, this.state.treeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }

    renderTreeNodes = data => {
        return data.map((item) => {
            const index = item.key.indexOf(this.state.searchValue);
            const beforeStr = item.key.substr(0, index);
            const afterStr = item.key.substr(index + this.state.searchValue.length);
            const title = index > -1 ? (
                <span>
              {beforeStr}
                    <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
                    {afterStr}
            </span>
            ) : <span>{item.key}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.title} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.title} dataRef={item} />;
        });
    }

    fetch = uuid => {

        //根据参数查询融资申请信息 ${uuid}
        request.get(`/companyInfo/queryCompanyTypeUuids/3`,{
        }).then(({data}) => {
            if(data.code===200) {
                this.setState({
                    expandedKeys: [...data.data],
                    checkedKeys: [...data.data],
                    selectedKeys: [...data.data],
                });
            }
        });
    }

    fetchTree = () => {
        this.mounted && this.setState({ treeLoading: true });
        request.get('/companyType/queryCompanyTypeTree',{
        }).then(({data}) => {

            const item = [];
            item.push(data.data);

            if(data.code===200) {
                this.mounted && this.setState({
                    treeData: [...item],
                    treeLoading: false,
                },()=>{
                    this.fetch(this.props.defaultItem.uuid);
                })
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

        /*if(nextProps.defaultItem.uuid !== this.props.defaultItem.uuid){
            this.fetch(nextProps.defaultItem.uuid);
        }*/
    }

    render() {
        const {modalType,visible} = this.props;
        return (
            <Modal
                key={this.state.editClassModalKey}
                confirmLoading={this.state.treeLoading}
                title={modalType ==='look' ? '查看' : '编辑分类' }
                visible={visible}
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={modalType ==='look' ? null : [
                    <Button key="clear" onClick={this.handleCancel}>取消</Button>,
                    <Button key="ok" type="primary"  onClick={this.handleOk}>
                        保存
                    </Button>
                ]}
            >
                <div>
                    <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                    <div style={{height:400,overflowY: 'auto'}}>
                            <Tree
                                checkable
                            //checkable={modalType !=='look'}

                            onExpand={this.onExpand}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}
                        >
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree>
                    </div>

                </div>

            </Modal>
        );
    }
}

export default EditClass