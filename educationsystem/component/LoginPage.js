import React from 'react'
import Link from 'next/link'
import { Form, Input, Button, Checkbox,Radio} from 'antd';
import { UserOutlined,LockOutlined } from '@ant-design/icons';
import Login from '../component/Login'


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 4,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 2,
  },
};

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            identity: 'student', 
        }
        this.onFinish=this.onFinish.bind(this);
        this.onFinishFailed=this.onFinishFailed.bind(this);
        this.handleSizeChange=this.handleSizeChange.bind(this);
    }
    handleSizeChange = e => {
        this.setState({ identity: e.target.value });
      };
    onFinish = (values) => {
        console.log('Success:', values);
      };
    
    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

  render() {
    const { identity } = this.state;
      return(
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={this.onFinish}
      onFinishFailed={this.onFinishFailed}
    >
        <h1>课程管理助手</h1>
        <br/>
        <Form.Item
        label = "type"
        >
        <Radio.Group value={identity} onChange={this.handleSizeChange}>
          <Radio.Button value="student">Student</Radio.Button>
          <Radio.Button value="teacher">Teacher</Radio.Button>
          <Radio.Button value="manager">Manager</Radio.Button>
        </Radio.Group>
        </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
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
        <Input placeholder="email" prefix={<UserOutlined />}/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password placeholder="Password" prefix={<LockOutlined />} minLength={4} maxLength={16} />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="">
          Forgot password
        </a>
        </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" identity={identity}>
          Login
        </Button>
        
        Or <Link href="/registrationpage"><a>register now!</a></Link>
      </Form.Item>
      <Login></Login>
    </Form>
  
    )};
};

export default Demo
