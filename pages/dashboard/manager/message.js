import React, { useEffect, useState } from 'react';
import { Avatar, Col, List, Row, Select, Space, Spin, Typography } from 'antd';
import AppLayout from '../../../component/Layout';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useListEffect } from '../../../lib/list-effect';
import { getMessages } from '../../../services/apiService';
import storage from '../../../services/storage';
import { flatten } from 'lodash';
export default function MessagePage() {
  const [type, setType] = useState(null);
  const [source, setSource] = useState({});
  const { paginator, setPaginator, data, hasMore } = useListEffect(getMessages, 'messages', true, {
    type,
    userId: storage.userId,
  });
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
      <div id="msg-container">
        {/* <InfiniteScroll
          next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
        //   hasMore={hasMore}
          loader={
            <div style={{ textAlign: 'center' }}>
              <Spin />
            </div>
          }
        //   dataLength={flatten(Object.values(source)).length}
          endMessage={<div style={{ textAlign: 'center' }}>No more</div>}
          scrollableTarget="msg-container"
        ></InfiniteScroll> */}
      </div>
    </AppLayout>
  );
}
