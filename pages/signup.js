import { UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Radio, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { omit, values } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Header from '../component/home/header';
import styled from 'styled-components';
import { signUp } from '../services/apiService';
import {userType} from '../component/userType'

const { Title } = Typography;

const StyledButton = styled(Button)`
  &&& {
    width: 100%;
  }
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin: 0.5em 0;
  @media (max-width: 700px) {
    margin-top: 2em;
    font-size: 18px !important;
    padding-bottom: 0;
  }
`;

export default function SignUpPage() {
  const [form] = useForm();
  const router = useRouter();
  const signUpFunction = async (values) => {
    console.log(values);
    const req = omit(values, 'confirmPassword');
    const { data } = await signUp(req);

    if (!!data) {
      router.push('login');
    }
  };

  return (
    <>
      <Header />

      <StyledTitle>Sign up your account</StyledTitle>

      <Row justify="center">
        <Col md={8} sm={24}>
          <Form
            name="signup"
            initialValues={{
              remember: true,
            }}
            onFinish={(values) => signUpFunction(values)}
            form={form}
            layout="vertical"
          >
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={userType.student}>Student</Radio>
                <Radio value={userType.teacher}>Teacher</Radio>
                <Radio value={userType.manager}>Manager</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="email" label="email" rules={[{ required: true }, { type: 'email' }]}>
              <Input prefix={<UserOutlined />} type="email" placeholder="Please input email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }, { min: 4, max: 16 }]}
            >
              <Input.Password placeholder="please input password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Tap password again" />
            </Form.Item>

            <Form.Item>
              <StyledButton type="primary" htmlType="submit">
                Sign Up
              </StyledButton>
            </Form.Item>
          </Form>

          <Space>
            <span>Already have an account?</span>
            <Link href="/login">Sign in</Link>
          </Space>

        </Col>
      </Row>
    </>
  );
}
