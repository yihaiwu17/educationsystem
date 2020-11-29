import React from 'react'
import { Layout, Menu,Input  } from 'antd';
import {
  UserOutlined,
  SelectOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import '../styles/globals.css'
import  Router from "next/router";
import TableInfo from '../component/table'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  signout = async()=>{
        await 
        fetch("/api/logout",{
          method: 'post',
        })
        .then((response) => {
          if (response.status === 200) {
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("token");
            Router.push('/')
          }
        })
    };
  
  onSearch = value => console.log(value);

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '200vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item >
            <h2>CMS</h2>
            <style jsx>{`
                h2 {
                color: white;
                text-align: center;
                }
            `}</style>
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<SelectOutlined />} title="Select User">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>

          </Menu>
        </Sider>
        <Layout className="site-layout">
        <Header className="site-layout-background" style={{ display:"flex",justifyContent:"space-between",padding:4,color:"white",fontSize:'20px'}}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
            {React.createElement(this.state.collapsed ? LogoutOutlined : LogoutOutlined, {
              float:"right",
              onClick: this.signout,
            })} 
          </Header>
          <Content style={{ margin: '16px 16px',padding:'5px'}}>
            <Search placeholder="input search text" onSearch={this.onSearch} style={{ width: 500 }} />
            <TableInfo></TableInfo>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default SiderDemo