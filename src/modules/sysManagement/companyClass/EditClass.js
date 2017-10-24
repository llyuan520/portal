/**
 * author       : liuliyuan
 * createTime   : 2017/10/13 10:11
 * description  :
 */
import React,{PureComponent} from 'react';
import {Modal,Tree,Input,Button,message} from 'antd';
import {request} from '../../../utils';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;


class EditClass extends PureComponent{
    state = {
        expandedKeys: [],
        checkedKeys:  [],
        selectedKeys: [],
        searchValue: '',
        autoExpandParent: true,


        dataList : [],
        checkeList:[],
        treeData:[],
        treeLoading:false,
        editClassModalKey:Date.now()+'1',

    }

    static defaultProps={
        modalType:'look'
    }

    handleOk = (e) => {
        const dataInfo = {
            companyId:this.props.defaultItem.uuid,
            companyTypes:[...this.state.checkedKeys]
        }
        console.log(dataInfo);
        request.post('/companyInfo/assignCompanyType', dataInfo)
            .then(({data}) => {
                if (data.code === 200) {
                    message.success('修改分类成功！');
                    //新增成功，关闭当前窗口,刷新父级组件
                    this.props.changeVisable(false);
                    this.props.refreshCurdTable();
                } else {
                    message.error(data.msg, 4)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.props.changeVisable(false);
                this.props.refreshCurdTable();
            })
    }

    handleCancel = (e) => {
        this.props.changeVisable(false);
    }

    generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.key;
            this.state.dataList.push({ key, title: node.title });
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
    onCheck = (checkedKeys) => {
        //console.log('checkedKeys', checkedKeys);
        this.setState({
            checkedKeys,
        });
        /*if(checkedKeys.length<7) {
            this.setState({
                checkedKeys,
            });
        }else{
            const data = checkedKeys.slice(0,6);
            this.setState({
                checkedKeys: [...data],
            });
            return message.warning('选中的分类不能大于5条！',4);
        }*/

    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }

    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = this.state.dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {

                return this.getParentKey(item.key, this.state.treeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);

        this.mounted && this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }

    renderTreeNodes = data => {
        return data.map((item) => {
            const index = item.title.indexOf(this.state.searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + this.state.searchValue.length);

            const title = index > -1 ? (
                <span>
              {beforeStr}
                    <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
                    {afterStr}
            </span>
            ) : <span>{item.title}</span>;

            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title} dataRef={item} >
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} dataRef={item} />;
        });
    }

    fetch = uuid => {
        request.get(`/companyInfo/queryCompanyTypeUuids/${uuid}`,{
        }).then(({data}) => {
            if(data.code===200) {
                this.setState((prevState) => {
                    return {
                        expandedKeys: prevState.expandedKeys.length > 0 ? [...data.data] : ['0'],
                        checkedKeys: [...data.data],
                        selectedKeys: [...data.data],
                    };
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
                    this.generateList(this.state.treeData);
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
        if(nextProps.defaultItem.uuid){
            this.fetch(nextProps.defaultItem.uuid);
        }
    }

    render() {
        const {modalType,visible} = this.props;
        const {expandedKeys,autoExpandParent,checkedKeys,selectedKeys,treeData,checkeList } = this.state;

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

                    <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={this.onChange} />

                    <div style={{height:400,overflowY: 'auto'}}>
                        <Tree
                            checkable={modalType !=='look'}
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onCheck={this.onCheck}
                            checkedKeys={checkedKeys}
                            onSelect={this.onSelect}
                            selectedKeys={selectedKeys}
                        >
                            {
                                modalType !=='look' ? this.renderTreeNodes(treeData) : this.renderTreeNodes(checkeList)
                            }

                        </Tree>
                    </div>

                </div>

            </Modal>
        );
    }
}

export default EditClass