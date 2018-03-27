/**
* Created by liuLiYuan on 2018/3/27.
*/

import React,{Component} from 'react'
import debounce from 'lodash/debounce';
import {Form,Select,Spin} from 'antd'
import PropTypes from 'prop-types'
import {request} from '../../utils'
const FormItem = Form.Item;
const Option = Select.Option


export default class TaxMain extends Component{
    static propTypes={
        form:PropTypes.object.isRequired,
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        fieldDecoratorOptions:PropTypes.object,
        componentProps:PropTypes.object
    }
    static defaultProps={
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:18
            }
        },
        fieldName:'companyName',
        fieldDecoratorOptions:{

        }
    }
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            fetching: false,
        }
        this.fetch = debounce(this.fetch, 300);
    }

    fetch = (value) => {
        this.setState({
            dataSource: [],
            fetching: true
        });
        request.get(`/userManage/loadCompanyList`,{
            params:{
                companyName:value,
                size:10
            }
        })
            .then(({data}) => {
                if(data.code===200){
                    const newData = data.data.map(r => ({
                        text: `${r.companyName}`,
                        value: r.companyCode,
                    }));
                    this.setState({
                        dataSource:newData,
                        fetching: false
                    });
                }
            });
    }
    handleChange = (value) => {
        this.props.onSuccess && this.props.onSuccess(value);
    }
    componentDidMount(){
        let key = (this.props.form.getFieldValue(`${this.props.fieldName}`) && this.props.form.getFieldValue(`${this.props.fieldName}`).label) || '';
        this.fetch(key)
    }
    render(){
        const { fetching, dataSource } = this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemStyle,fieldName,fieldDecoratorOptions,componentProps} = this.props;
        return(
            <FormItem label="&nbsp;" {...formItemStyle}>
                {getFieldDecorator(fieldName,{
                    ...fieldDecoratorOptions
                })(
                    <Select
                        showSearch
                        labelInValue
                        placeholder="请输入要查找的公司名称"
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={(value)=>value && this.fetch(value)}
                        onChange={this.handleChange}
                        style={{ width: '100%' }}
                        {...componentProps}
                    >
                        {dataSource.map((item,i) => <Option key={i}  value={item.value}>{item.text}</Option>)}
                    </Select>
                )}
            </FormItem>
        )
    }
}