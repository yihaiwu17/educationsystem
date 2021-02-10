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
  getMonth,
  getYear,
} from 'date-fns';
import { ClockCircleOutlined, NotificationFilled } from '@ant-design/icons';


const courseTypeColors = [
  'magenta',
  'volcano',
  'orange',
  'gold',
  'green',
  'cyan',
  'crimson',
  'purple',
  'red',
  'lime',
];

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
  const [notifyInfo, setNotifyInfo] = useState(null);

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
          <Row
            gutter={[6, 6]}
            key={index}
            style={{ fontSize: 12 }}
            onClick={() => setNotifyInfo(item)}
          >
            <Col span={1}>
              <ClockCircleOutlined />
            </Col>
            <Col span={8} offset={1}>
              {item.class.time}
            </Col>
            <Col offset={1}
              style={{color:courseTypeColors[item.type[0]?.id % 9]}}
            >{item.name}</Col>
          </Row>
        ))}
      </>
    );
  };

  const monthCellRender = (current) => {
    const month = getMonth(current);
    const year = getYear(current);
    const result = data
      .map((course) => {
        const result = course.calendar.filter((item) => {
          const classMonth = getMonth(item.date);
          const classYear = getYear(item.date);

          return classYear === year && classMonth === month;
        });
        const total = result.length;

        return !!total ? { ...course, statistics: { total } } : null;
      })
      .filter((item) => !!item);

    return result.length ? (
      <>
        {result.map((course) => (
          <Row gutter={[6, 6]} key={course.id}>
            <Col>
              <b>{course.name}</b>
            </Col>
            <Col offset={1}>{course.statistics.total} lessons</Col>
          </Row>
        ))}
      </>
    ) : null;
  };

  useEffect(() => {
    getClassSchedule(storage.userId).then((res) => {
      const { data } = res;
      const result = data.map((course) => ({ ...course, calendar: generateClassCalendar(course) }));

      setData(result);
    });
  }, []);
  return (
    <AppLayout>
      <Card title="My Class Schedule">
        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
      </Card>

      <Modal
        title="Class Info"
        visible={!!notifyInfo}
        footer={null}
        onCancel={() => setNotifyInfo(null)}
      >
        <Descriptions>
        <Descriptions.Item span={8} label="Course Name">
          {notifyInfo?.name}
        </Descriptions.Item>
        <Descriptions.Item span={8} label="Chapter N.O">
          {notifyInfo?.schedule.chapters.findIndex((item) => item.id === notifyInfo?.class.chapter?.id)+1}
        </Descriptions.Item>
        <Descriptions.Item span={8} label="Course Type">
          {notifyInfo?.type[0]?.name}
        </Descriptions.Item>
        <Descriptions.Item span={8} label="Teacher Name">
          {notifyInfo?.teacherName}
        </Descriptions.Item>
        <Descriptions.Item span={8} label="Class Time">
          {notifyInfo?.class.time}

          <Tooltip
            title="Remend me"
          >
            <NotificationFilled
              style={{color:'#1890ff',marginLeft:10,cursor:'pointer'}}
              onClick={() => {
                setNotifyInfo(null)
              }}
            ></NotificationFilled>
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item span={8} label="Chapter Name">
          {notifyInfo?.class.chapter?.name}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="Chapter Content">
          {notifyInfo?.class.chapter?.content}
        </Descriptions.Item>
        </Descriptions>
      </Modal>
    </AppLayout>
  );
}
