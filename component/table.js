import { Table, Space, Popconfirm, Input, Button } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { studentApi, deleteStudentApi } from '../services/apiService';
import { debounce, omitBy } from 'lodash';
import { formatDistanceToNow } from 'date-fns';
import ModalForm from '../component/modalForm';
import AddStudentForm from '../component/AddStudentForm';
import { PlusOutlined } from '@ant-design/icons';

const Search = styled(Input.Search)`
  width: 30%;
  margin-bottom: 16px;
  display: block;
`;

const TableInfo = () => {
  let [studentData, setStudentData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });

  const [query, setQuery] = useState('');
  const debouncedQuery = useCallback(
    debounce((nextValue) => setQuery(nextValue), 1000),
    []
  );

  const columnData = [
    {
      title: 'No.',
      key: 'index',
      render: (value, row, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a['name'].localeCompare(b['name']),
    },
    {
      title: 'Area',
      dataIndex: 'area',
      width: '10%',
      filters: [
        { text: '加拿大', value: '加拿大' },
        { text: '澳洲', value: '澳洲' },
        { text: '国内', value: '国内' },
      ],
      onFilter: (value, record) => record.area.indexOf(value) === 0,
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Selected Curriculum',
      dataIndex: 'courses',
      width: '25%',
      render: (courses) => courses?.map((item) => item.name).join(','),
    },
    {
      title: 'Student Type',
      dataIndex: 'typeName',
      width: '15%',
      filters: [
        { text: 'developer', value: 'developer' },
        { text: 'tester', value: 'tester' },
      ],
      onFilter: (value, record) => record.typeName === value,
    },
    {
      title: 'Join Time',
      dataIndex: 'ctime',
      render: (value) => formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setEditingStudent(record);
              setModalDisplay(true);
            }}
          >
            Edit
          </a>

          <Popconfirm
            title="确定删除这个学生?"
            onConfirm={() => {
              const id = record.id;
              console.log(id);
              deleteStudentApi({ id }).then((res) => {
                const deleteInfo = res;
                if (deleteInfo.data.data === true) {
                  const index = studentData.findIndex((item) => item.id === record.id);
                  const newStudentData = [...studentData];
                  newStudentData.splice(index, 1);
                  setStudentData(newStudentData);
                  setTotal(total - 1);
                }
              });
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [isModalDisplay, setModalDisplay] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const cancel = () => {
    setModalDisplay(false);
    setEditingStudent(null);
  };

  useEffect(async () => {
    const req = omitBy(
      { limit: pagination.pageSize, page: pagination.current, query },
      (item) => item === ''
    );

    await studentApi(req).then((res) => {
      const { studentInfo, total } = res.data.data;
      setStudentData(studentInfo);
      setTotal(total);
    });
  }, [query, pagination]);

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setModalDisplay(true);
          setEditingStudent(null);
        }}
      >
        Add
      </Button>
      <Search
        placeholder="input search text"
        onSearch={(value) => setQuery(value)}
        onChange={(event) => {
          debouncedQuery(event.target.value);
        }}
        style={{ width: 500, marginBottom: '20px', float: 'right' }}
      />
      <Table
        columns={columnData}
        dataSource={studentData}
        onChange={setPagination}
        rowKey="id"
        pagination={{ ...pagination, total }}
      />

      <ModalForm
        title={!!editingStudent ? 'Edit Student' : 'Add Student'}
        centered
        visible={isModalDisplay}
        cancel={cancel}
      >
        <AddStudentForm
          onFinish={(student) => {
            /**
             * update local data if editing success
             */
            if (!!editingStudent) {
              console.log(editingStudent);
              const index = data.findIndex((item) => item.id === student.id);

              data[index] = student;
              setStudentData([...data]);
            }

            setModalDisplay(false);
          }}
          student={editingStudent}
        />
      </ModalForm>
    </>
  );
};

export default TableInfo;
