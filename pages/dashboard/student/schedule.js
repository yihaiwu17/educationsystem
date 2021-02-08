import AppLayout from '../../../component/Layout';
import Calendar from '../../../lib/calendar';
import { Card, Col, Descriptions, Modal, Row, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { getClassSchedule } from '../../../services/apiService';
import storage from '../../../services/storage';
import { cloneDeep, omit, orderBy } from 'lodash';
import {
  getDay,
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  isSameDay,
} from 'date-fns';
import { ClockCircleOutlined, NotificationFilled } from '@ant-design/icons';

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function sortWeekdaysBy(weekDays, start) {
  const startWeekDay = getDay(start);

  weekDays = orderBy(weekDays, ['weekday', 'time'], ['asc', 'asc']);

  const firstIndex = weekDays.findIndex((item) => item.weekday === startWeekDay);
  const head = weekDays.slice(firstIndex);
  const rest = weekDays.slice(0, firstIndex);

  return [...head, ...rest];
}

function generateClassCalendar(course) {
  const {
    startTime,
    durationUnit,
    duration,
    schedule: { classTime, chapters },
  } = course;

  if (!classTime) {
    return [];
  }

  const chaptersCopy = cloneDeep(chapters);
  const start = new Date(startTime);
  const addFns = [addYears, addMonths, addDays, addWeeks, addHours];
  const end = addFns[durationUnit - 1](start, duration);
  const days = differenceInCalendarDays(end, start);

  const transformWeekday = (day) => weekDays.findIndex((item) => item === day);
  const classTimes = classTime.map((item) => {
    const day = item.split(' ')[0];
    const time = item.split(' ')[1];

    const weekday = transformWeekday(day);
    return { weekday, time };
  });
  const sortedClassTimes = sortWeekdaysBy(classTimes, start);
  const getClassInfo = (day) => sortedClassTimes.find((item) => item.weekday === day);
  const result = [{ date: start, chapter: chaptersCopy.shift(), weekday: getDay(start), time: '' }];

  for (let i = 1; i < days; i++) {
    const date = addDays(start, i);
    const day = getDay(date);
    const classInfo = getClassInfo(day);

    if (classInfo) {
      const chapter = chaptersCopy.shift();

      result.push({ date, chapter, ...classInfo });
    }
  }
  return result;
}

export default function schedulePage() {
  const [data, setData] = useState([]);

  const dateCellRender = (current) => {

    const listData = data
      .map((course) => {
        const { calendar } = course;
        const target = calendar.find((item) => isSameDay(current, item.date));

        return !!target ? { class: target, ...omit(course, 'calendar') } : null;
      })
      .filter((item) => !!item);


    return (
      <>
        {listData.map((item, index) => (
          <Row gutter={[6, 6]} key={index} style={{ fontSize: 12 }}>
            <Col span={1}>
              <ClockCircleOutlined />
            </Col>
            <Col span={8} offset={1}>
              {item.class.time}
            </Col>
            <Col offset={1}>{item.name}</Col>
          </Row>
        ))}
      </>
    );
  };

  useEffect(() => {
    getClassSchedule(storage.userId).then((res) => {
      const { data } = res;
      const result = data.map((course) => ({ ...course, calendar: generateClassCalendar(course) }));
      console.log(result);
      setData(result);
    });
  }, []);
  return (
    <AppLayout>
      <Card title="My Class Schedule">
        <Calendar dateCellRender={dateCellRender} />
      </Card>
    </AppLayout>
  );
}
