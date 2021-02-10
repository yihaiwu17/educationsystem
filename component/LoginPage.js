import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Radio, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Router from 'next/router';
import styled from 'styled-components';
import { userType } from './userType';
import {axiosApi} from '../services/apiService'
import {AES} from 'crypto-js'
import Header from '../component/home/header'

const StyledButton = styled(Button)`
  &&& {
    width: 100%;
  }
`;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginType: 'student',
      remember: true,
    };
    this.onFinish = this.onFinish.bind(this);
    this.onFinishFailed = this.onFinishFailed.bind(this);
  }

  onFinish = async (values) => {
    try {
      const response = await axiosApi.post('login', {
        email: values.email,
        password: AES.encrypt(values.password,'cms').toString(),
        role: values.loginType,
      });
      if (response.status === 201) {
        const account = response.data;
        console.log(account)
        localStorage.setItem('cmsUser', JSON.stringify(account));

        Router.push('/dashboard');
      }
    } catch (error) {

      message.error('Login failed! Please check you email and password!');
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const { loginType } = this.state;

    return (
      <>
      <Header></Header>
        <Row justify="center" style={{ marginTop: '5%' }}>
          <Col span={12}>
            <Form
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <h1>课程管理助手</h1>

              <Form.Item
                name="loginType"
                initialValue="student"
                rules={[
                  {
                    required: true,
                    message: 'Please select login type',
                  },
                ]}
              >
                <Radio.Group
                  value={loginType}
                  onChange={(e) => {
                    this.setState({ loginType: e.target.value });
                  }}
                >
                  <Radio.Button value={userType.student}>Student</Radio.Button>
                  <Radio.Button value={userType.teacher}>Teacher</Radio.Button>
                  <Radio.Button value={userType.manager}>Manager</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input placeholder="email" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  {
                    min: 4,
                    max: 16,
                    message: 'password must between 4 and 16',
                  },
                ]}
              >
                <Input.Password placeholder="Password" prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <StyledButton type="primary" htmlType="submit">
                  Login
                </StyledButton>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}

export default LoginPage;
