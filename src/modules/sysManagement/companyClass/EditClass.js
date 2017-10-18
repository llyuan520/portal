/**
 * author       : liuliyuan
 * createTime   : 2017/10/13 10:11
 * description  :
 */
import React,{PureComponent} from 'react';
import {Modal,Tree,Input} from 'antd';
import {request} from '../../../utils';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const treeData = [{
    title: '0-0',
    key: '0-0',
    children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
        ],
    }, {
        title: '0-0-1',
        key: '0-0-1',
        children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
        ],
    }, {
        title: '0-0-2',
        key: '0-0-2',
    }],
}, {
    title: '0-1',
    key: '0-1',
    children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
    ],
}, {
    title: '0-2',
    key: '0-2',
}];

class EditClass extends PureComponent{
    state = {
        expandedKeys: ['0-0-0', '0-0-1'],
        checkedKeys:  ['0-0-0'],
        selectedKeys: [],
        searchValue: '',
        autoExpandParent: true,

        dataList : [],
        editClassModalKey:Date.now()+'1',
    }

    handleOk = (e) => {
        console.log(this.props.uuid);
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
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
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
                return this.getParentKey(item.key, treeData);
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
                    <TreeNode key={item.key} title={title}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} />;
        });
    }

    fetch = uuid => {
        //根据参数查询融资申请信息
        request.get(`/companyType/queryCompanyTypeInfo/${uuid}`,{
        }).then(({data}) => {
            console.log(data);
            if(data.code===200) {
                this.generateList(treeData);
            }
        });
    }

    componentDidMount() {
        console.log(this.props.uuid);
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.uuid !== this.props.uuid){
            this.fetch(nextProps.uuid);
        }
        console.log(nextProps)

    }

    render() {

        return (
            <Modal
                key={this.state.editClassModalKey}
                title="编辑分类"
                visible={this.props.visible}
                okText="保存"
                cancelText="取消"
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <div>
                    <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                    <div style={{height:400,overflowY: 'auto'}}>
                        <Tree
                            checkable
                            onExpand={this.onExpand}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}
                        >
                            {this.renderTreeNodes(treeData)}
                        </Tree>
                    </div>

                </div>

            </Modal>
        );
    }
}

export default EditClass