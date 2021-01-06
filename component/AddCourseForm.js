import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Input, Select } from 'antd';
import {teachersApi} from '../services/apiService'

export default function AddCourseForm() {
  return (
    <>
      <Form labelCol={{ offset: 1 }} wrapperCol={{ offset: 1 }} layout="vertical">
        <Row>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="name"
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
                    placeholder='Select teacher'
                    filterOption={false}
                    showSearch
                    onSearch={(query)=>{
                            teachersApi({query}).then((res)=>{
                            const {data} = res
                            
                        })
                    }}
                  >

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
