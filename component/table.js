import { Table, Space, Popconfirm, Input } from 'antd';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { studentApi } from '../services/apiService';
import axios from 'axios';
import { set } from 'js-cookie';

const Search = styled(Input.Search)`
  width: 30%;
  margin-bottom: 16px;
  display: block;
`;

const columnData = [
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

const TableInfo = () => {
  let [studentData, setStudentData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  });

  function onChange(pagination, filters, sorter, extra) {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      showSizeChanger: true,
    });
    console.log('params', pagination, filters, sorter, extra);
  }

  const handleOnchange = (e) => {
    setParams({ ...params, query: e.target.value });
    console.log(params);
  };

  async function searchFunction() {
    console.log(params);
    const res = await studentApi(params);
    if (res.status === 200) {
      console.log('11');
      setStudentData(res.data.data.students);
      console.log(res.data);
      setPagination({
        current: res.data.data.page,
        pageSize: res.data.data.limit,
        showSizeChanger: true,
      });
    }
  }

  useEffect(async () => {
    await studentApi(params)
      .then((res) => {
        setStudentData(res.data.data.students);
        console.log(res);
        setPagination({
          current: res.data.data.page,
          pageSize: res.data.data.limit,
          showSizeChanger: true,
        });
      })
      .catch((e) => {
        console.error(e.message);
      });
  }, []);

  return (
    <>
      <Search
        placeholder="input search text"
        onSearch={searchFunction}
        onChange={handleOnchange}
        style={{ width: 500, marginBottom: '20px' }}
      />
      <Table
        columns={columnData}
        dataSource={studentData}
        onChange={onChange}
        rowKey="id"
        pagination={pagination}
      />
    </>
  );
};

export default TableInfo;
