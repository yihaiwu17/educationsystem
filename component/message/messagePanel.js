import { Badge, Dropdown, Tabs, Row, Col, Button, Spin, Avatar, List } from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import storage from '../../services/storage';
import { useListEffect } from '../../lib/list-effect';
import { getMessages, markAsRead } from '../../services/apiService';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useMsgStatistic} from '../../lib/provider'


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
    getMessages.bind(this),
    'message',
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

              [item.id].then((res) => {
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
  return (
    <Badge size="small" offset={[10, 0]}>
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
                  <Tabs.TabPane key={type} tab={type}>
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
                  </Tabs.TabPane>
                ))}
              </Tabs>
              <Row justify="space-between" align="middle">
                <Col span={12}>
                  <Button>Mark all as read</Button>
                </Col>
                <Col span={12}>
                  <Button>
                    <Link href={`/dashboard/${storage.userType}/message`}>View history</Link>
                  </Button>
                </Col>
              </Row>
            </>
          }
        >
          <BellOutlined style={{ fontSize: 24, marginTop: 5 }} />
        </Dropdown>
      </HeaderIcon>
    </Badge>
  );
}
