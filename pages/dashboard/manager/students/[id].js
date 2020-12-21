import AppLayout from '../../../../component/Layout';
import { Card, Row, Col, Avatar, Tabs, Tag, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { studentDetailApi } from '../../../../services/apiService';
import styled from 'styled-components';

const H3 = styled.h3`
  font-size: 24px;
  color: #9932cc;
`;

const tagColor = ['magenta', 'volcano', 'orange', 'red', 'green', 'purple', 'yellow'];
const columnData = [
  {
    title: 'No.',
    key: 'index',
    render: (value, row, index) => index + 1,
  },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Type', dataIndex: 'type' },
  {
    title: 'Join Time',
    dataIndex: 'ctime',
  },
];

export default function StudentDetail() {
  const router = useRouter();
  const [info, setInfo] = useState([]);
  const [imageUrl, setImagUrl] = useState();
  const [address, setAddress] = useState();
  const [aboutDetail, setAboutDetail] = useState([]);
  const [description, setDescription] = useState();
  const [insDetail, setInsDetail] = useState([]);
  const [course, setCourse] = useState([]);
  const { TabPane } = Tabs;

  useEffect(async () => {
    const id = router.query.id;
    const detail = await studentDetailApi(id);
    const info = [
      { label: 'Name', value: detail.data.data.student.name },
      { label: 'Age', value: detail.data.data.student.age },
      { label: 'Email', value: detail.data.data.student.email },
      { label: 'Phone', value: detail.data.data.student.phone },
    ];
    const aboutDetail = [
      { label: 'Education:', value: detail.data.data.student.education },
      { label: 'Area:', value: detail.data.data.student.area },
      { label: 'Gender:', value: detail.data.data.student.gender === 1 ? 'Male' : 'Female' },
      { label: 'Member Period:', value: detail.data.data.student.updateAt },
      { label: 'Type:', value: detail.data.data.student.typeName },
      { label: 'Create Time:', value: detail.data.data.student.ctime },
      { label: 'Update Time:', value: detail.data.data.student.updateAt },
    ];
    const description = detail.data.data.student.description;
    const imageUrl = detail.data.data.student.avatar;
    const address = detail.data.data.student.address;
    const insDetail = detail.data.data.student.interest;
    const course = detail.data.data.student.courses;
    console.log(course)
    setCourse(course);
    setImagUrl(imageUrl);
    setInsDetail(insDetail);
    setDescription(description);
    setAboutDetail(aboutDetail);
    setAddress(address);
    setInfo(info);
  }, []);

  return (
    <AppLayout>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={imageUrl}
                style={{ width: 100, height: 100, display: 'block', margin: 'auto' }}
              />
            }
          >
            <Row>
              {info.map((item) => {
                return (
                  <Col span={12} key={item.label} style={{ textAlign: 'center' }}>
                    <b>{item.label}</b>
                    <p>{item.value}</p>
                  </Col>
                );
              })}
              <Col style={{ textAlign: 'center' }} span={24}>
                <b>Address</b>
                <p>{address}</p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="About" key="1">
                <H3>Information</H3>
                <Row>
                  {aboutDetail.map((item) => {
                    return (
                      <Col span={24} key={item.label}>
                        <b style={{ display: 'inline', marginRight: 24 }}>{item.label}</b>
                        <span>{item.value}</span>
                      </Col>
                    );
                  })}
                </Row>
                <H3>Interesting</H3>
                <Row>
                  {insDetail.map((item, index) => {
                    return (
                      <Tag key={index + item} color={tagColor[index]}>
                        {item}
                      </Tag>
                    );
                  })}
                </Row>

                <H3>Description</H3>
                <p>{description}</p>
              </TabPane>

              <TabPane tab="Courses" key="2">
                <Table columns={columnData} dataSource={course} />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
