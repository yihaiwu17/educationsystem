import AppLayout from '../../../../component/Layout';
import { Card, Row, Col, Avatar, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { studentDetailApi } from '../../../../services/apiService';

export default function StudentDetail() {
  const router = useRouter();
  const [info, setInfo] = useState([]);
  const [imageUrl, setImagUrl] = useState();
  const { TabPane } = Tabs;

  useEffect(async () => {
    const id = router.query.id;
    const detail = await studentDetailApi(id);
    const info = [
      { label: 'Name', value: detail.data.data.student.name },
      { label: 'Age', value: detail.data.data.student.age },
    ];
    const imageUrl = detail.data.data.student.avatar;
    setImagUrl(imageUrl);
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
                  <Col key={item.label}>
                    <b>{item.label}</b>
                    <p>{item.value}</p>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="About" key="1">
                <h3>Information</h3>

                <h3>Interesting</h3>

                <h3>Description</h3>
              </TabPane>
              <TabPane tab="Courses" key="2">
                Content of Tab Pane 2
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
