import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  SelectOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import '../styles/globals.css';
import Router from 'next/router';
import styled from 'styled-components';
import generateKey from '../lib/side-nav'
import { useUserType } from './login-state';

const { Header, Content, Sider } = Layout;

class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  signOut = async () => {
    await fetch('/api/logout', {
      method: 'post',
    }).then((response) => {
      if (response.status === 200) {
        window.localStorage.removeItem('cmsUser');
        window.localStorage.removeItem('token');
        Router.push('/');
      }
    });
  };

  renderMenuItems(data, parent = ''){
    const userType = useUserType()

    return data.map((item,index) => {
      const key = generateKey(item,index)

      if(item.subNav && item.subNav.length){
        return (
          <Menu.SubMenu key={key} title={item.label} icon ={item.icon}>
            {this.renderMenuItems(item.subNav, item.path.join('/'))}
          </Menu.SubMenu>
        )
      }else{
        return(
          <Menu.Item key={key} title={item.label} icon = {item.icon}>
           {!!item.path.length || item.label.toLocaleLowerCase() === 'overview' ? (
             <Link
              href={['/dashboard', userType, parent, ...item.path]
                .filter((item) => !!item)
                .join('/')}
                replace
             >
                {item.label}
             </Link>
           ):(
             item.label
           )} 
          </Menu.Item>
        )
      }
    })
  }

  render() {
    const { collapsed } = this.state;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div
            style={{
              height: '64px',
              display: 'inline-flex',
              fontSize: '24px',
              color: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              letterSpacing: '5px',
              textShadow: '5px 1px 5px',
            }}
          >
            CMS
          </div>

          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />} style={{ marginTop: 0 }}>
              Member List
            </Menu.Item>

            <Menu.Item key="2" icon={<SelectOutlined />}>
              Select Member
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 4,
              color: 'white',
              fontSize: '20px',
              alignItems: 'center',
            }}
          >
            <div onClick={this.toggle} style={{ margin: '25px', cursor: 'pointer' }}>
              {this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>

            <div onClick={this.signOut} style={{ margin: '25px', cursor: 'pointer' }}>
              {this.state.collapsed ? <LogoutOutlined /> : <LogoutOutlined />}
            </div>
          </Header>

          <Content
            style={{ background: '#fff', margin: '15px', padding: '15px', minHeight: 'auto' }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default AppLayout;
