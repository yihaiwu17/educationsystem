import {
  Badge,
  Dropdown,
  Tabs,
  Row,
  Col,
  Button,
  Spin,
  Avatar,
  List,
  Space,
  notification,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import storage from '../../services/storage';
import { useListEffect } from '../../lib/list-effect';
import {
  getMessages,
  markAsRead,
  getMessageStatistic,
  messageEvent,
} from '../../services/apiService';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useMsgStatistic } from '../../lib/provider';
import { formatDistanceToNow } from 'date-fns';

const TabPane = styled(Tabs.TabPane)`
  position: relative;
  .ant-list-item {
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
      background: #1890ff45;
    }
  }
  .ant-list-item-meta-title {
    margin-bottom: 0;
  }
  .ant-list-item-action {
    margin: 0 0 0 48px;
  }
  .ant-list-item-meta-avatar {
    align-self: flex-end;
  }
  .ant-list-item-meta-description {
    margin: 5px 0;
    white-space: normal;
    display: -webkit-box;
    max-height: 3em;
    max-width: 100%;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ant-list-item-meta {
    margin-bottom: 0;
  }
`;

const Footer = styled(Row)`
  height: 50px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  .ant-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      box-shadow: 1px 0 0 0 #f0f0f0;
    }
  }
  button {
    border: none;
  }
  border-radius: 0 0 4px 4px;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-right: none;
  background: #fff;
  z-index: 9;
`;

const MessageContainer = styled.div`
  height: 380px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const TabNavContainer = styled.div`
  margin-bottom: 0;
  padding: 10px 20px 0 20px;
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
  }
`;

const HeaderIcon = styled.span`
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
`;

function Messages(props) {
  const { paginator, setPaginator, hasMore, data, setData } = useListEffect(
    getMessages,
    'messages',
    false,
    { type: props.type }
  );

  useEffect(() => {
    if (props.clearAll && data && data.length) {
      const ids = data.filter((item) => item.status === 0).map((item) => item.id);

      if (ids.length) {
        markAsRead(ids).then((res) => {
          if (res.data) {
            setData(data.map((item) => ({ ...item, status: 1 })));
          }

          if (props.onRead) {
            props.onRead(ids.length);
          }
        });
      } else {
        message.warn(`All of these ${props.type}s has been marked as read!`);
      }
    }
  }, [props.clearAll]);

  useEffect(() => {
    if (!!props.message && props.message.type === props.type) {
      setData([props.message, ...data]);
    }
  }, [props.message]);

  return (
    <InfiniteScroll
      next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
      hasMore={hasMore}
      loader={
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      }
      dataLength={data.length}
      endMessage={<div style={{ textAlign: 'center' }}>No more</div>}
      scrollableTarget={props.scrollTarget}
    >
      <List
        style={{ paddingLeft: '5px' }}
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            style={{ opacity: item.status ? 0.4 : 1 }}
            actions={[
              <Space>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</Space>,
            ]}
            onClick={() => {
              if (item.status === 1) {
                return;
              }

              markAsRead([item.id]).then((res) => {
                if (res.data) {
                  const target = data.find((msg) => item.id === msg.id);

                  target.status = 1;
                  setData([...data]);
                }

                if (props.onRead) {
                  props.onRead(1);
                }
              });
            }}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.from.nickname}
              description={item.content}
            />
          </List.Item>
        )}
      ></List>
    </InfiniteScroll>
  );
}

export default function MessagePanel() {
  const [activeType, setActiveType] = useState('notification');
  const types = ['notification', 'message'];
  const [message, setMessage] = useState(null);
  const { msgStore, dispatch } = useMsgStatistic();
  const [clean, setClean] = useState({
    notification: 0,
    message: 0,
  });

  useEffect(() => {
    getMessageStatistic().then((res) => {
      const { data } = res;

      if (!!data) {
        const {
          receive: { notification, message },
        } = data;

        dispatch({ type: 'increment', payload: { type: 'message', count: message.unread } });
        dispatch({
          type: 'increment',
          payload: { type: 'notification', count: notification.unread },
        });
      }
    });

    const sse = messageEvent();
    sse.onmessage = (event) => {
      let { data } = event;
      data = JSON.parse(data || {});

      if (data.type !== 'heartbeat') {
        const content = data.content;
        if (content.type === 'message') {
          notification.info({
            message: `You have a message from ${content.from.nickname}`,
            description: content.content,
          });
        }
        setMessage(content);
        dispatch({ type: 'increment', payload: { type: content.type, count: 1 } });
      }
    };
    return () => {
      sse.close();
      dispatch({ type: 'reset' });
    };
  }, []);

  return (
    <Badge size="small" offset={[10, 0]} count={msgStore.total}>
      <HeaderIcon>
        <Dropdown
          overlayStyle={{
            background: '#fff',
            borderRadius: 4,
            width: 400,
            height: 500,
            overflow: 'hidden',
          }}
          placement="bottomRight"
          trigger={['click']}
          overlay={
            <>
              <Tabs
                renderTabBar={(props, DefaultTabBar) => (
                  <TabNavContainer>
                    <DefaultTabBar {...props} />
                  </TabNavContainer>
                )}
                onChange={(key) => {
                  if (key !== activeType) {
                    setActiveType(key);
                  }
                }}
                animated
              >
                {types.map((type) => (
                  <TabPane key={type} tab={`${type} (${msgStore[type]})`}>
                    <MessageContainer id={type}>
                      <Messages
                        type={type}
                        scrollTarget={type}
                        clearAll={clean[type]}
                        onRead={(count) => {
                          dispatch({ type: 'decrement', payload: { type, count } });
                        }}
                        message={message}
                      ></Messages>
                    </MessageContainer>
                  </TabPane>
                ))}
              </Tabs>
              <Footer justify="space-between" align="middle">
                <Col span={12}>
                  <Button onClick={() => setClean({...clean,[activeType]: ++clean[activeType]})}
                    >Mark all as read</Button>
                </Col>
                <Col span={12}>
                  <Button>
                    <Link href={`/dashboard/${storage.userType}/message`}>View history</Link>
                  </Button>
                </Col>
              </Footer>
            </>
          }
        >
          <BellOutlined style={{ fontSize: 24, marginTop: 5 }} />
        </Dropdown>
      </HeaderIcon>
    </Badge>
  );
}
