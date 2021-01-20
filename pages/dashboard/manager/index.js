import React, { useEffect, useState } from 'react';
import { DeploymentUnitOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Select } from 'antd';
import AppLayout from '../../../component/Layout';
import styled from 'styled-components';
import { getStatisticsOverview } from '../../../services/apiService';

const IconCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  .anticon {
    background: #fff;
    padding: 25px;
    border-radius: 50%;
    color: #999;
  }
`;

const OverView = ({ style, icon, title, data }) => {
  const lastMonthAddedPercent = parseFloat(
    String((data?.lastMonthAdded / data.total) * 100)
  ).toFixed(1);
  return (
    <Card style={{ borderRadius: 5, cursor: 'pointer', ...style }}>
      <Row>
        <IconCol span={6}>{icon}</IconCol>
        <Col span={18} style={{ color: '#fff' }}>
          <h3 style={{ color: '#fff' }}>{title}</h3>
          <h2 style={{ color: '#fff', fontSize: '32px', marginBottom:'0px' }}>{data?.total}</h2>
          <Progress
            percent={100 - lastMonthAddedPercent}
            size="small"
            showInfo={false}
            strokeColor="white"
            trailColor="lightgreen"
          ></Progress>  
          <p>{`${lastMonthAddedPercent + '%'} Increase in 30 Days`}</p>
        </Col>
      </Row>
    </Card>
  );
};

export default function ManagerPage() {
  const [overview, setOverView] = useState(null);

  useEffect(() => {
    getStatisticsOverview().then((res) => {
      console.log(res);
      const { data } = res.data;
      console.log(data);
      setOverView(data);
    });
  }, []);
  return (
    <AppLayout>
      {overview && (
        <Row gutter={[24, 16]} >
          <Col span={8}>
            <OverView
              icon={<SolutionOutlined />}
              style={{ background: '#1890ff' }}
              title="TOTAL STUDENTS"
              data={overview?.student}
            ></OverView>
          </Col>
          <Col span={8}>
            <OverView
              icon={<DeploymentUnitOutlined />}
              style={{ background: '#673bb7' }}
              title="TOTAL TEACHERS"
              data={overview?.teacher}
            ></OverView>
          </Col>
          <Col span={8}>
            <OverView
              icon={<ReadOutlined />}
              style={{ background: '#ffaa16' }}
              title="TOTAL COURSES"
              data={overview?.course}
            ></OverView>
          </Col>
        </Row>
      )}
    </AppLayout>
  );
}
