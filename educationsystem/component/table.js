import { Table,Space } from 'antd';
import { useEffect, useState } from 'react';

const columns = [
    {
        title:'ID',
        dataIndex:'id',
    },
    {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Jim',
        value: 'Jim',
      },
      {
        text: 'Submenu',
        value: 'Submenu',
        children: [
          {
            text: 'Green',
            value: 'Green',
          },
          {
            text: 'Black',
            value: 'Black',
          },
        ],
      },
    ],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Area',
    dataIndex: 'address',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Selected Curriculum',
    dataIndex: 'selected curriculum',
  },
  {
    title: 'Student Type',
    dataIndex: 'student type',
  },
  {
    title: 'Join Time',
    dataIndex: 'join time',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}

const TableInfo = ()=>{
    let [status, setStatus] = useState("loading");
    let [studentData,setStudentData]= useState([])

    useEffect(async ()=>{
        await fetch("/api/studentInfo")
        .then(res => res.json() )
        .then(json => {
            setStudentData(json)
            setStatus("success")
        })
        .catch(e =>{
            console.error(e.message);
            setStatus("error")
        })
    },[])

    return(
        <>
        <Table columns={columns} dataSource={studentData} onChange={onChange} />
        </>
    )
}

export default TableInfo