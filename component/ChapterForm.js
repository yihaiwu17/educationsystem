import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, Row, Col, message, TimePicker} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';

const weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const chapterInfo ='chapterInfo'
const classInfo = 'classInfo'
const { Option } = Select;

export default function ChapterForm() {
  const [form] = Form.useForm();


  const initialValue ={
      [chapterInfo]:[{name:'',content:''}],
      [classInfo]:[{weekday:'',time:''}],
  }
  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  const handleChange = () => {
    form.setFieldsValue({ sights: [] });//need to change
  };

  return (
    <Form
      form={form}
      name="course schedule"
      onFinish={onFinish}
      autoComplete="off"
      style={{ padding: '0 1.6%' }}
      initialValues={initialValue}
    >
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <h2>Chapter</h2>
          <Form.List name={chapterInfo}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} align="baseline" gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={([field.name, 'name'])}
                        fieldKey={[field.fieldKey,'name']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Name"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        fieldKey={[field.fieldKey,'content']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Content"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined
                        onClick={() => {
                          if (fields.length > 1) {
                            remove(field.name);
                          } else {
                            message.warn('You must set at least one class time');
                          }
                        }}
                      />
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add chapters
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={12}>
          <h2>Class times </h2>
          <Form.List name={classInfo}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} align="baseline" gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={([field.name, 'weekday'])}
                        fieldKey={[field.fieldKey,'weekday']}
                        rules={[{ required: true }]}
                      >
                        <Select size='large'>
                            {weekDays.map((day)=>(
                                <Option key={day} value={day}>
                                    {day}
                                </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={([field.name, 'time'])}
                        fieldKey={[field.fieldKey,'time']}
                        rules={[{ required: true }]}
                      >
                       <TimePicker size='large' style={{width:'100%'}}></TimePicker>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined
                        onClick={() => {
                          if (fields.length > 1) {
                            remove(field.name);
                          } else {
                            message.warn('You must set at least one class time');
                          }
                        }}
                      />
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} disabled={fields.length >= 7}>
                        Add chapters
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
