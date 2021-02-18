import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import '../styles/globals.css';
import Router from 'next/router';
import { generateKey, omitDetailPath, generateFactory, generatePath } from '../lib/side-nav';
import { routes } from '../lib/routes';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { memoize } from 'lodash';
import AppBreadcrumb from '../lib/breadcrumb';
import MessagePanel from './message/messagePanel';
import { Row } from 'antd';
import UserIcon from './home/user-icon';

const { Header, Content, Sider } = Layout;

class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
    this.renderMenuItems = this.renderMenuItems.bind(this);
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  // signOut = async () => {
  //   await fetch('/api/logout', {
  //     method: 'post',
  //   }).then((response) => {
  //     if (response.status === 200) {
  //       window.localStorage.removeItem('cmsUser');
  //       window.localStorage.removeItem('token');
  //       Router.push('/');
  //     }
  //   });
  // };

  renderMenuItems(data, parent = '') {
    const userType = this.props.router.pathname.split('/')[2];

    return data.map((item, index) => {
      const key = generateKey(item, index);

      if (item.subNav && item.subNav.length) {
        return (
          <Menu.SubMenu key={key} title={item.label} icon={item.icon}>
            {this.renderMenuItems(item.subNav, item.path.join('/'))}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={key} title={item.label} icon={item.icon}>
            {!!item.path.length || item.label.toLocaleLowerCase() === 'overview' ? (
              <Link
                href={['/dashboard', userType, parent, ...item.path]
                  .filter((item) => !!item)
                  .join('/')}
                replace
              >
                {item.label}
              </Link>
            ) : (
              item.label
            )}
          </Menu.Item>
        );
      }
    });
  }

  getMenuConfig = (data) => {
    const key = this.getActiveKey(data);
    const defaultSelectedKeys = [key.split('/').pop()];
    const defaultOpenKeys = key.split('/').slice(0, -1);

    return { defaultSelectedKeys, defaultOpenKeys };
  };

  getActiveKey = (data) => {
    const activeRoute = omitDetailPath(this.pathname);
    const { paths, keys } = this.memoizedGetKeyPathInfo(data);
    const index = paths.findIndex((item) => item === activeRoute);

    return keys[index] || '';
  };

  getKeyPathInfo = (data) => {
    const getPaths = generateFactory(generatePath);
    const userType = this.userType;
    const paths = getPaths(data)
      .reduce((acc, cur) => [...acc, ...cur], [])
      .map((item) => ['/dashboard', userType, item].filter((item) => !!item).join('/'));
    const getKeys = generateFactory(generateKey);
    const keys = getKeys(data).reduce((acc, cur) => [...acc, ...cur], []);

    return { keys, paths };
  };

  memoizedGetKeyPathInfo = memoize(this.getKeyPathInfo, (data) =>
    data.map((item) => item.label).join('_')
  );

  getSideNavNameByPath = (data, path) => {
    if (this.isDetailPath(path)) {
      return ['Detail'];
    }
    const { paths, keys } = this.memoizedGetKeyPathInfo(data);
    const index = paths.findIndex((item) => item === path);

    return this.getSideNavNameByKey(keys[index]);
  };

  getSideNavNameByKey = (key) => {
    return key.split('/').map((item) => item.split('_')[0]);
  };

  isDetailPath = (path) => {
    const paths = path.split('/');
    const length = paths.length;
    const last = paths[length - 1];
    const reg = /\[.*\]/;

    return reg.test(last);
  };

  pathname = this.props.router.pathname;
  userType = this.props.router.pathname.split('/')[2];
  sideNave = routes.get(this.userType);

  render() {
    const { collapsed } = this.state;
    const menuItems = this.renderMenuItems(this.sideNave);
    const { defaultOpenKeys, defaultSelectedKeys } = this.getMenuConfig(this.sideNave);

    return (
      <Layout style={{ height: '100vh' }}>
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

          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            defaultSelectedKeys={defaultSelectedKeys}
          >
            {menuItems}
          </Menu>
        </Sider>

        <Layout id="contentLayout">
          <Header
            className="site-layout-background"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: 'white',
              fontSize: '20px',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <span onClick={this.toggle} style={{  cursor: 'pointer' }}>
              {this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>

            <Row align="middle">
              <MessagePanel></MessagePanel>
              <UserIcon></UserIcon>
            </Row>
          </Header>

          <Content
            style={{ background: '#fff', margin: '15px', padding: '15px', minHeight: 'auto' }}
          >
            <AppBreadcrumb getSideNavNameByPath={this.getSideNavNameByPath}></AppBreadcrumb>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(AppLayout);
