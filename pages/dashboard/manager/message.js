import React, { useEffect, useState } from 'react';
import { Avatar, Col, List, Row, Select, Space, Spin, Typography } from 'antd';
import AppLayout from '../../../component/Layout';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useListEffect } from '../../../lib/list-effect';
import { getMessages,markAsRead } from '../../../services/apiService';
import storage from '../../../services/storage';
import { flatten, values } from 'lodash';
import { useMsgStatistic } from '../../../lib/provider';
import { format } from 'date-fns';
import { AlertOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';

export default function MessagePage() {
  const [type, setType] = useState(null);
  const [source, setSource] = useState({});
  const { paginator, setPaginator, data, hasMore } = useListEffect(getMessages, 'messages', true, {
    type,
    userId: storage.userId,
  });
  const { dispatch } = useMsgStatistic();
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const result = data.reduce((acc, cur) => {
      const key = format(new Date(cur.createdAt), 'yyyy-MM-dd');

      if (!acc[key]) {
        acc[key] = [cur];
      } else {
        acc[key].push(cur);
      }

      return acc;
    }, source);
    console.log(result);
    const flattenResult = Object.entries(result).sort(
      (pre, next) => new Date(next[0]).getTime() - new Date(pre[0]).getTime()
    );
    console.log(flattenResult);
    setSource({ ...result });
    setDataSource(flattenResult);
  }, [data]);

  return (
    <AppLayout>
      <Row align="middle">
        <Col span={8}>
          <Typography.Title level={2}> Recent Messages</Typography.Title>
        </Col>
        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
          <Select
            defaultValue={null}
            onSelect={(value) => {
              setType(value);
              setPaginator({ ...paginator, page: 1 });
              setSource({});
            }}
            style={{ minWidth: 100 }}
          >
            <Select.Option value={null}>All</Select.Option>
            <Select.Option value="notification">Notification</Select.Option>
            <Select.Option value="message">Message</Select.Option>
          </Select>
        </Col>
      </Row>
      <div id="msg-container" style={{ padding: '0 20px', overflowY: 'scroll', maxHeight: '75vh' }}>
        <InfiniteScroll
          next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
          hasMore={hasMore}
          loader={
            <div style={{ textAlign: 'center' }}>
              <Spin />
            </div>
          }
          dataLength={flatten(Object.values(source)).length}
          endMessage={<div style={{ textAlign: 'center' }}>No more</div>}
          scrollableTarget="msg-container"
        >
          <List
            itemLayout="vertical"
            dataSource={dataSource}
            renderItem={([date, values], index) => (
              <>
                <Space size="large">
                  <Typography.Title level={4}>{date}</Typography.Title>
                </Space>
                {values.map((item) => (
                  <List.Item
                    key={item.createdAt+index}
                    style={{ opacity: item.status ? 0.4 : 1 }}
                    actions={[<Space>{item.createdAt}</Space>]}
                    extra={
                      <Space>
                        {item.type === 'notification' ? <AlertOutlined /> : <MessageOutlined />}
                      </Space>
                    }
                    onClick={() => {
                      if(item.status ===1) {
                        return;
                      }

                      markAsRead([item.id]).then((res) => {
                        if(res.data){
                          let target = null
                          try {
                            dataSource.forEach(([_, values]) => {
                              const result = values.find((value) => value.id === item.id);

                              if (!!result) {
                                target = result;
                                throw new Error('just end loop');
                              }
                            });
                          } catch (err) {
                            // nothing;
                          }

                          target.status = 1;
                          setDataSource([...dataSource]);
                          dispatch({ type: 'decrement', payload: { count: 1, type: item.type } });
                        
                        }
                      })
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.from.nickname}
                      description={item.content}
                    />
                  </List.Item>
                ))}
              </>
            )}
          ></List>
        </InfiniteScroll>
      </div>
    </AppLayout>
  );
}
