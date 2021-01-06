import { Steps } from 'antd';
import AppLayout from '../../../../component/Layout';
import React, { useEffect, useState } from 'react';
import AddCourseForm from '../../../../component/AddCourseForm'

export default function AddCourse() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps=[<AddCourseForm/>]

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

      {steps.map((content,index) => (
          <div key={index} style={{display: index === currentStep ? 'block':'none'}}>
              {content}
          </div>
      ))}
    </AppLayout>
  );
}
