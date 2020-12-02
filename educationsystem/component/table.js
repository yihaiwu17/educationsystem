import { Table, Space, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a['name'].localeCompare(b['name']),
  },
  {
    title: 'Area',
    dataIndex: 'address',
    width: '10%',
    filters: [
      { text: '加拿大', value: '加拿大' },
      { text: '澳洲', value: '澳洲' },
      { text: '国内', value: '国内' },
    ],
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Selected Curriculum',
    dataIndex: 'selectedCurriculm',
    width: '25%',
  },
  {
    title: 'Student Type',
    dataIndex: 'studentType',
    width: '15%',
    filters: [
      { text: '开发', value: '开发' },
      { text: '测试', value: '测试' },
    ],
  },
  {
    title: 'Join Time',
    dataIndex: 'joinTime',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Link href={''}>
          <a>Edit</a>
        </Link>

        <Popconfirm title="确定删除这个学生?" onConfirm={() => {}} okText="确定" cancelText="取消">
          <a>Delete</a>
        </Popconfirm>
      </Space>
    ),
  },
];

function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}

const TableInfo = () => {
  let [studentData, setStudentData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });

  useEffect(async () => {
    await fetch('/api/students')
      .then((res) => res.json())
      .then((json) => {
        setStudentData(json.students);
      })
      .catch((e) => {
        console.error(e.message);
      });
  }, []);

  return (
    <>
      <Table
        columns={columns}
        dataSource={studentData}
        onChange={onChange}
        rowKey="id"
        pagination={pagination}
      />
    </>
  );
};

export default TableInfo;
