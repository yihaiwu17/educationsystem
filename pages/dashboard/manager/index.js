import React, { useEffect, useState } from 'react';
import { DeploymentUnitOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Select } from 'antd';
import AppLayout from '../../../component/Layout';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { getStatisticsOverview,getStatisticsByStudent,getStatisticsByTeacher,getStatisticsByCourse } from '../../../services/apiService';
import {userType} from '../../../component/userType'
import PieChart from '../../../component/manager/pieChart'
import LineChart from '../../../component/manager/lineChart'
import BarChart from '../../../component/manager/barChart'

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

const DistributionWithNoSSR = dynamic(() => import('../../../component/manager/distribution'), {
  ssr: false,
});

export default function ManagerPage() {
  const [overview, setOverView] = useState(null);
  const [studentStatistics,setStudentStatistics] = useState(null)
  const [teacherStatistics,setTeacherStatistics] = useState(null)
  const [courseStatistics,setCourseStatistics] = useState(null)
  const [distributionRole,setDistributionRole] = useState(userType.student)
  const [selectedType, setSelectedType] = useState('studentType');

  useEffect(() => {
    getStatisticsOverview().then((res) => {
      const { data } = res.data;
      setOverView(data);
    });

    getStatisticsByStudent().then((res) => {
      const  studentData  = res.data.data;

      setStudentStatistics(studentData)

    });

    getStatisticsByTeacher().then((res) => {
      const teacherData = res.data.data
      setTeacherStatistics(teacherData)
    })

    getStatisticsByCourse().then((res) => {
      const courseData = res.data.data
      setCourseStatistics(courseData)
    })
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
      <Row gutter={[16,16]}>
        <Col span={12}>
          <Card
            title='Distribution'
            extra={
              <Select defaultValue='student' bordered={false} onSelect={setDistributionRole}>
                <Select.Option value={userType.student}>Student</Select.Option>
                <Select.Option value={userType.teacher}>Teacher</Select.Option>
              </Select>
            }
          >
            <DistributionWithNoSSR
              data ={
                (distributionRole === userType.student ?
                studentStatistics?.area : teacherStatistics?.country)}
              title={distributionRole}
            ></DistributionWithNoSSR>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title='Types'
            extra={
              <Select defaultValue={selectedType} bordered={false} onSelect={setSelectedType}>
                <Select.Option value="studentType">Student Type</Select.Option>
                <Select.Option value="courseType">Course Type</Select.Option>
                <Select.Option value="gender">Gender</Select.Option>
              </Select>
            }
          >
            {selectedType === 'studentType' ? (
              <PieChart
              title={selectedType}
              data={studentStatistics?.typeName}
              ></PieChart>
            ):selectedType === 'courseType' ? (
              <PieChart data={courseStatistics?.typeName} title={selectedType} />
            ):(
              <Row gutter={16}>
                <Col span={12}>
                  <PieChart
                    title='student gender'
                    data={Object.entries(overview.student.gender).map(([name,amount]) => ({name,amount}))}
                  ></PieChart>
                </Col>
                <Col span={12}>
                  <PieChart
                    title='teacher gender'
                    data={Object.entries(overview.teacher.gender).map(([name,amount]) => ({name,amount}))}
                  ></PieChart>
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title='Increment'
          >
            <LineChart
              data={{
                [userType.student]: studentStatistics?.ctime,
                [userType.teacher]: teacherStatistics?.ctime,
                course: courseStatistics?.ctime,
              }}
            ></LineChart>
          </Card>
        </Col>
        <Col span={12}>
            <Card title='Language'>
              <BarChart
                data={{interest: studentStatistics?.interest,
                teacher: teacherStatistics?.skills}}
              >
              </BarChart>
            </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
