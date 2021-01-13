import { Table} from 'antd';
import React from 'react'

const weekdays = [
    'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
]


export default function WeekdaysTable({data}) {
    
    const header = [...weekdays]
    const columns = header.map((title,index)=>{
        const target = data.find((item)=> item.toLocaleLowerCase().includes(title.toLocaleLowerCase())) || '';
        const time = target.split(' ')[1]

        return{title:title, key:index, align:'center', render:()=>time}
    })
    const dataSource = new Array(1).fill({id:0})

    return(
        <Table
            rowKey='id'
            bordered
            size='small'
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            onRow={()=>({
                onMouseEnter:(event)=>{
                    const parent = (event.target).parentNode;
                    Array.prototype.forEach.call(parent.childNodes,(item)=>{
                        item.style.background='transparent'
                    })
                    parent.style.background='transparent'   
                }
            })}
        >
        </Table>
    )
}