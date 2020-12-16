import { Button, Form, Input, Select } from 'antd';
import React from 'react';
import { addStudentApi, updateStudentApi } from '../services/apiService';
import styled from 'styled-components';

const validateMessages = {
  required: '${name} is required',
};

export default function AddStudentForm(props) {
  const [form] = Form.useForm();
  const { onFinish, student } = props;

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ offset: 1 }}
      form={form}
      validateMessages={validateMessages}
      onFinish={(values) => {
        console.log(student);
        const response = !student
          ? addStudentApi(values)
          : updateStudentApi({ ...values, id: student.id });

        response.then((response) => {
          const { data } = response;

          if (onFinish) {
            onFinish(data);
          }
        });
      }}
      initialValues={{
        name: student?.name,
        email: student?.email,
        area: student?.area,
        typeId: student?.typeId,
      }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input type="text" placeholder="student name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: 'email', message: 'email format invalid' }]}
      >
        <Input type="email" placeholder="email" />
      </Form.Item>

      <Form.Item label="Area" name="area" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="China">China</Select.Option>
          <Select.Option value="Canada">Canada</Select.Option>
          <Select.Option value="New Zealand">New Zealand</Select.Option>
          <Select.Option value="Australia">Australia</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Student Type" name="type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value={1}>Tester</Select.Option>
          <Select.Option value={2}>Developer</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        shouldUpdate={true}
        style={{ position: 'absolute', bottom: '0', right: '8em', marginBottom: '10px' }}
      >
        {() => (
          <Button type="primary" htmlType="submit">
            {!!student ? 'Update' : 'Add'}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
