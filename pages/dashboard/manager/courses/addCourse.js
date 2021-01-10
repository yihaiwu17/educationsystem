import { Steps, Result, Button } from 'antd';
import AppLayout from '../../../../component/Layout';
import React, { useState } from 'react';
import AddCourseForm from '../../../../component/AddCourseForm';
import ChapterForm from '../../../../component/ChapterForm';
import { useRouter } from 'next/router';

export default function AddCourse() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    <AddCourseForm />,
    <ChapterForm/>,
    <Result
      status="success"
      title="Successfully Create Course"
      extra={[
        <Button type="primary" key="detail"
        >
          Go Console
        </Button>,
        <Button key="again"
        onClick={() => {
          router.reload();
        }}
        >Create Again</Button>,
      ]}
    />,
  ];

  return (
    <AppLayout>
      <Steps
        type="navigation"
        style={{ margin: '20px 0', padding: '1em 1.6%' }}
        current={currentStep}
        onChange={(current) => {
          setCurrentStep(current);
        }}
      >
        <Steps.Step title="Course Detail" />
        <Steps.Step title="Course Schedule" />
        <Steps.Step title="Success" />
      </Steps>

      {steps.map((content, index) => (
        <div key={index} style={{ display: index === currentStep ? 'block' : 'none' }}>
          {content}
        </div>
      ))}
    </AppLayout>
  );
}
