import { Card, Row, Col } from 'antd';
import { HeartFilled, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledRow = styled(Row)`
  position: relative;
  :after {
    content: '';
    position: absolute;
    bottom: 0;
    background: #ccc;
    width: 100%;
    height: 1px;
  }
`;

const durUnit = [
  'year','month','day','week','hour'
]

const getDuration =(data)=>{
  const {duration,durationUnit} = data
  const text = `${duration} ${durUnit[durationUnit]}`

  return duration >1 ? text+'s':text
}

export default function CourseView(props) {
  const gutter= [6, 16];
  return (
    <Card cover={<img alt="coursePng" src={props.cover} />}>
      <Row gutter={gutter}>
        <h3>
          <b>{props.name}</b>
        </h3>
      </Row>

      <StyledRow gutter={gutter} justify="space-between" align="middle">
        <Col>{props.startTime}</Col>
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: 'red' }} />
          <b>{props.star}</b>
        </Col>
      </StyledRow>

      <StyledRow gutter={gutter} justify="space-between">
        <Col>Duration:</Col>
        <Col>
        <b>{getDuration(props)}</b>
        </Col>
      </StyledRow>

      <StyledRow  gutter={gutter} justify="space-between">
        <Col>Teacher:</Col>
        <Col>
          <b>{props.teacherName}</b>
        </Col>
      </StyledRow>

      <Row gutter={gutter} justify="space-between">
        <Col>
          <UserOutlined style={{ marginRight: 5, fontSize: 16, color: "#1890ff" }}/>
          <span>Student Amount:</span>
        </Col>
        <Col>
          <b>{props.maxStudents}</b>
        </Col>
      </Row>
      {props.children}
    </Card>
  );
}
