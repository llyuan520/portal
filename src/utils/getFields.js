/**
 * Created by LiuLiYuan on 2018/3/28.
 */
import React from 'react';
import {Form,Col, Input,Select,DatePicker} from 'antd';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

const getFields=(start,end,form,data=[])=>{
    const { getFieldDecorator,getFieldValue,setFieldsValue } = form;
    const defaultFormItemStyle = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    };

    if(typeof data === 'function'){
        /**
         * 当fieldsData为function的时候，必须要在最后返回fieldsData*/
        data = data(getFieldValue,setFieldsValue)
    }

    const children = [];

    data.map((item,i)=> {
        let CusComponent;
        const type = item.type;
        let formItemStyle = item.formItemStyle || defaultFormItemStyle;
        switch (type) {
            case 'input':
                CusComponent = Input;
                break;
            case 'rangePicker':
                CusComponent = RangePicker;
                break;
            case 'datePicker':
                CusComponent = DatePicker;
                break;
            case 'select':
                CusComponent = Select;
                break;
            default:
                CusComponent = Input
        }

        if(type === 'rangePicker') {

            children.push(
                <Col span={8} key={i}>
                    <FormItem label={item['notLabel'] === true ? null : item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent {...item['componentProps']} placeholder={ (item['componentProps'] && item['componentProps'].placeholder) || [`开始时间`,`结束时间`] } style={{width:'100%'}} />
                        )}
                    </FormItem>
                </Col>
            );
        }else if(type === 'select'){
            children.push(
                <Col span={8} key={i}>
                    <FormItem label={item['notLabel'] === true ? null : item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent {...item['componentProps']} placeholder={`请选择${item['label']}`} >
                                {
                                    item.options.map((option,i)=>(
                                        <Option key={i} value={option.value}>{option.label}</Option>
                                    ))
                                }
                            </CusComponent>
                        )}
                    </FormItem>
                </Col>
            );
        }else {
            children.push(
                <Col span={8} key={i}>
                    <FormItem label={item['notLabel'] === true ? null : item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent {...item['componentProps']} placeholder={ (item['componentProps'] && item['componentProps'].placeholder) || `请输入${item['label']}` } style={{width:'100%'}} />
                        )}
                    </FormItem>
                </Col>
            );
        }

        return children;
    })

    return children.slice(start,end || null);
}

export default getFields