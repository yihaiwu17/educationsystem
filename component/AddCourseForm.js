import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Input, Select } from 'antd';
import { teachersApi, courseTypeApi } from '../services/apiService';

export default function AddCourseForm() {
  const [teachers, setTeachers] = useState([]);
  const [courseType, setCourseType] = useState([]);

  useEffect(() => {
    courseTypeApi().then((res) => {
      const courseType = res.data.data.courseType;
      setCourseType(courseType);
    });
  }, []);

  return (
    <>
      <Form labelCol={{ offset: 1 }} wrapperCol={{ offset: 1 }} layout="vertical">
        <Row>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="course name"
              rules={[{ required: true }, { max: 100, min: 3 }]}
            >
              <Input type="text" placeholder="course name"></Input>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Row>
              <Col span={8}>
                <Form.Item label="Teacher" name="TeacherId" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select teacher"
                    filterOption={false}
                    showSearch
                    onSearch={(query) => {
                      teachersApi({ query }).then((res) => {
                        const { data } = res;
                        setTeachers(data.data.all);
                      });
                    }}
                  >
                    {teachers.map(({ name, id }) => (
                      <Select.Option key={id} value={id}>
                        {name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Type" name="typeId" rules={[{ required: true }]}>
                  <Select>
                    {courseType.map((type) => (
                      <Select.Option value={type.id} key={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
}
