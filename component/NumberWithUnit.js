import React from 'react';
import {Input,InputNumber, Select } from 'antd';


const NumberWithUni =({value={},onChange,options,defaultUnit}) => {

    return(
        <Input.Group compact style={{display:'flex'}}>
            <InputNumber value={value.number} style={{flex:1}}></InputNumber>
            <Select value ={value.unit} defaultValue={defaultUnit}>
                {options.map(({label,unit})=>(
                    <Select.Option value={unit} key={unit}>
                        {label}
                    </Select.Option>
                ))}
            </Select>
        </Input.Group>
    )
}


export default NumberWithUni;