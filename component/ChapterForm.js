import React, { useEffect, useState } from 'react';
import { Input, Button, Select, Row, Col, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { updateProcessApi, processById } from '../services/apiService';
import { format } from 'date-fns';
import Form from 'antd/lib/form';
import TimePicker from '../component/timePicker';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const clsTime = 'classTime';
const cpts = 'chapters';
const { Option } = Select;

export default function ChapterForm({ courseId, onSuccess, scheduleId, isAdd = true }) {
  const [form] = Form.useForm();
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const updateSelectedWeekdays = (namePath) => {
    const selected = form.getFieldValue(clsTime) || [];
    let result = selected.map((item) => item.weekday);

    if (namePath) {
      const value = form.getFieldValue(namePath);

      result = result.filter((item) => item !== value);
    }
    setSelectedWeekdays(result);
  };

  const initialValue = {
    [cpts]: [{ name: '', content: '' }],
    [clsTime]: [{ weekday: '', time: '' }],
  };
  const onFinish = (values) => {
    // if (!courseId && !scheduleId) {
    //   message.error('You must select a course to update!');
    //   return;
    // }

    const { classTime: origin, chapters } = values;
    const classTime = origin.map(({ weekday, time }) => `${weekday} ${format(time, 'hh:mm:ss')}`);
    const req = { chapters, classTime, scheduleId, courseId };

    updateProcessApi(req).then((res) => {
      const { data } = res;
      console.log(res);
      if (!!onSuccess && data) {
        onSuccess(true);
      }
    });
  };

  useEffect(() => {
    (async () => {
      if (!scheduleId || isAdd) {
        return;
      }
      console.log(scheduleId);
      const { data } = await processById({ id: scheduleId });
      console.log(data);
      if (!!data) {
        const classTimes = data.data.classTime.map((item) => {
          const [weekday, time] = item.split(' ');

          return { weekday, time: new Date(`2020-11-11 ${time}`) };
        });

        form.setFieldsValue({ chapters: data.data.chapters, classTime: classTimes });
        setSelectedWeekdays(classTimes.map((item) => item.weekday));
      }
    })();
  }, [scheduleId]);

  return (
    <Form
      form={form}
      name="process"
      onFinish={onFinish}
      autoComplete="off"
      style={{ padding: '0 1.6%' }}
      initialValues={initialValue}
    >
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <h2>Chapter</h2>
          <Form.List name={cpts}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} align="baseline" gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Name"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        fieldKey={[field.fieldKey, 'content']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Content"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined
                        onClick={() => {
                          if (fields.length > 1) {
                            remove(field.name);
                          } else {
                            message.warn('You must set at least one class time');
                          }
                        }}
                      />
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add chapters
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={12}>
          <h2>Class times </h2>
          <Form.List name="classTime">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} align="baseline" gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'weekday']}
                        fieldKey={[field.fieldKey, 'weekday']}
                        rules={[{ required: true }]}
                      >
                        <Select size="large">
                          {weekDays.map((day) => (
                            <Option key={day} value={day} disabled={selectedWeekdays.includes(day)}>
                              {day}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'time']}
                        fieldKey={[field.fieldKey, 'time']}
                        rules={[{ required: true }]}
                      >
                        <TimePicker size="large" style={{ width: '100%' }}></TimePicker>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined
                        onClick={() => {
                          if (fields.length > 1) {
                            updateSelectedWeekdays([clsTime, field.name, 'weekday']);
                            remove(field.name);
                          } else {
                            message.warn('You must set at least one class time');
                          }
                        }}
                      />
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => {
                          updateSelectedWeekdays();
                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                        disabled={fields.length >= 7}
                      >
                        Add Class Time
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
