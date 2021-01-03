import { courseDetailApi } from '../../../../services/apiService';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CourseView from '../../../../component/courseView';
import AppLayout from '../../../../component/Layout';
import { Row, Col, Card, Badge,Steps,Tag,Collapse   } from 'antd';
import styled from 'styled-components';

const H2 = styled.h2`
  color: #7356f1;
`;

const StyleRow = styled(Row)`
  width: calc(100% + 48px);
  margin: 0 0 0 -24px !important;
`;

const StyleCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-bottom: none;
  p {
    margin-bottom: 0;
  }
  :last-child {
    border-right: none;
  }
  b {
    font-size: 24px;
    color: #7356f1;
  }
`;

const CourseStatus = ['warning', 'success', 'default'];

const chapterExtra=(currentOpen,currentStep,index)=>{
  const activeIndex = currentStep.findIndex((item)=> item.id === currentOpen)

  if(index === activeIndex){
    return(<Tag color={'green'}>进行中</Tag>)
  }else if(index <activeIndex){
    return(<Tag color={'default'}>已完成</Tag>)
  }else{
    return(<Tag color={'orange'}>未开始</Tag>)
  }
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: { id },
  };
}

export default function CourseDetail() {
  const router = useRouter();
  const [info, setInfo] = useState([]);
  const [saleDetail, setSaleDetail] = useState([]);
  const [currentStep,setCurrentStep] = useState([]);
  const [currentOpen,setCurrentOpen] = useState();
  const [activeChapterIndex,setActiveChapterIndex] = useState(0);

  useEffect(async () => {
    const id = router.query.id || props.id;
    const courseDetail = await courseDetailApi(id);
    console.log(courseDetail);
    const info = courseDetail.data.data.courseData;
    const saleInfo = courseDetail.data.data.courseData.sales;
    const currentOpen =courseDetail.data.process.schedules.current;
    const currentStep = courseDetail.data.process.schedules.chapters
    const saleDetail = [
      { label: 'Price', value: saleInfo.price },
      { label: 'Batch', value: saleInfo.batches },
      { label: 'Students', value: saleInfo.studentAmount },
      { label: 'Earings', value: saleInfo.earnings },
    ];
    setSaleDetail(saleDetail);
    setInfo(info);
    setCurrentOpen(currentOpen)
    setActiveChapterIndex(
      courseDetail.data.process.schedules.chapters.findIndex((item)=> 
        item.id === courseDetail.data.process.schedules.current
      )
    );
    setCurrentStep(currentStep)
    console.log(currentOpen)
  }, []);

  return (
    <AppLayout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <CourseView {...info} cardProps={{ bodyStyle: { paddingBottom: 0 } }}>
            <StyleRow gutter={[6, 16]} align="middle" justify="space-between">
              {saleDetail.map((item) => (
                <StyleCol key={item.label} span="6">
                  <b>{item.value}</b>
                  <p>{item.label}</p>
                </StyleCol>
              ))}
            </StyleRow>
          </CourseView>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <H2>Course Detail</H2>
            <h3 margin="1em 0">Create Time</h3>
            <Row>{info.ctime}</Row>
            <h3>Start Time</h3>
            <Row>{info.startTime}</Row>
            <Badge status={CourseStatus[info.status]} offset={[5,24]}>
              <h3>Status</h3>
            </Badge>
            <Row>
              <Steps size="small" current={activeChapterIndex}>
                {currentStep.map((item) => (
                  <Steps.Step title={item.name} key={item.id}></Steps.Step>
                ))}
              </Steps>
            </Row>
            <h3>Course Code</h3>
            <Row>{info.uid}</Row>

            <h3>Class Time</h3>

            <h3>Category</h3>
            <Row>
              <Tag color={'geekblue'}> {info.typeName}</Tag>
            </Row>

            <h3>Description</h3>
            {info.detail !=='no' ? (
              <Row> {info.detail}</Row>
            ):(
              <Row>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur, voluptatem velit reprehenderit sequi, nam, corrupti eum natus exercitationem est illum quibusdam placeat excepturi aperiam accusantium voluptatibus incidunt assumenda iure at!
              </Row>
            )}

            <h3>Chapter</h3>
            <Collapse defaultActiveKey={currentOpen}>
              {currentStep.map((item,index)=>(
                <Collapse.Panel header={item.name} key={item.id} extra={chapterExtra(currentOpen,currentStep,index)}>
                <p>{item.content}</p>
                </Collapse.Panel>
              ))}
            </Collapse> 
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
