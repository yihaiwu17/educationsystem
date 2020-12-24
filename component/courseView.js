import { Card, Row, Col } from 'antd';
import { HeartFilled, UserOutlined } from '@ant-design/icons';

export default function CourseView({ value }) {
  return (
    <Card cover={<img alt="coursePng" src={value.cover} />}>
      <Row>
        <h3>
          <b>{value.name}</b>
        </h3>
      </Row>

      <Row justify="space-between">
        <Col>{value.startTime}</Col>
        <Col>
          <HeartFilled style={{ color: 'red' }} />
          <b>{value.star}</b>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col>Duration:</Col>
      </Row>

      <Row justify="space-between">
        <Col>Teacher:</Col>
        <Col>
          <b>{value.teacher}</b>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col>
          <UserOutlined />
          <span>Student Amount:</span>
        </Col>
        <Col>
          <b>{value.maxStudents}</b>
        </Col>
      </Row>
    </Card>
  );
}
