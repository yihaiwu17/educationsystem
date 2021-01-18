import React, { useCallback, useState } from 'react';
import AddCourseForm from '../../../../component/AddCourseForm';
import ChapterForm from '../../../../component/ChapterForm';
import AppLayout from '../../../../component/Layout';
import { Input, Select, Row, Col, Tabs } from 'antd';
import { debounce } from 'lodash';
import { coursesDetailApi } from '../../../../services/apiService';

const { Option } = Select;

export default function EditCoursePage() {
  const [searchKeyword, setSearchKeyword] = useState('uid');
  const [courseResult, setCourseResult] = useState([]);
  const [course, setCourse] = useState();

  const search = useCallback(
    debounce((value) => {
      coursesDetailApi({ [searchKeyword]: value }).then((res) => {
        const data = res.data.data;
        setCourseResult(data.courses);
      });
    }, 1000),
    [searchKeyword]
  );

  return (
    <AppLayout>
      <Row gutter={[6, 16]}>
        <Col span={12} style={{ marginLeft: '1.6%' }}>
          <Input.Group compact size="large" style={{ display: 'flex' }}>
            <Select defaultValue="uid" onChange={(value) => setSearchKeyword(value)}>
              <Option value="uid">Code</Option>
              <Option value="name">Name</Option>
              <Option value="type">Category</Option>
            </Select>
            <Select
              placeholder={`Search course by ${searchKeyword}`}
              filterOption={false}
              showSearch
              onSearch={search}
              style={{ flex: 1 }}
              onSelect={(id) => {
                const course = courseResult.find((item) => item.id === id);
                setCourse(course);
              }}
            >
              {courseResult.map(({ id, name, teacherName, uid }) => (
                <Select.Option key={id} value={id}>
                  {name} - {teacherName} - {uid}
                </Select.Option>
              ))}
            </Select>
          </Input.Group>
        </Col>
      </Row>
      <Tabs
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} style={{ marginLeft: '1.6%' }} />
        )}
        type="card"
        size="large"
        animated
      >
        <Tabs.TabPane key="course" tab="Course Detail">
          <AddCourseForm course={course} />
        </Tabs.TabPane>
        <Tabs.TabPane key="chapter" tab="Course Schedule">
          <ChapterForm courseId={course?.id} scheduleId={course?.scheduleId} isAdd={false} />
        </Tabs.TabPane>
      </Tabs>
    </AppLayout>
  );
}
