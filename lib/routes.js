import {
    AlibabaOutlined,
    FileOutlined,
    PlayCircleOutlined,
    SelectOutlined,
    TeamOutlined,
    UpOutlined,
    UserOutlined,
    YoutubeOutlined,
    UserAddOutlined,
    CaretUpOutlined,
    EditOutlined,
  } from '@ant-design/icons';
import React from 'react';
import {userType} from '../component/userType'

export const RoutePath={
    manager : 'manager',
    teachers : 'teachers',
    students : 'students',
    selectStudents : 'selectStudents',
    courses : 'courses',
    addCourse:'addCourse',
    editCourse:'editCourse',
  }

const students = {
    path: [],
    label: 'Students',
    icon: <YoutubeOutlined />,
    subNav: [
      { path: [RoutePath.students], label: 'Student List', icon: <UserOutlined /> },
      {
        path: [RoutePath.selectStudents],
        label: 'Select Students',
        icon: <SelectOutlined />,
        subNav: [{ path: ['aa'], label: 'Test', icon: <UpOutlined /> }],
      },
    ],
  };
  
const courses= {
    path: [],
    label: 'Courses',
    icon: <FileOutlined />,
    subNav:[
      {path:[RoutePath.courses],label:'All Courses', icon:<CaretUpOutlined />},
      {path:[RoutePath.courses,RoutePath.addCourse],label:'Add Course', icon:<UserAddOutlined />},
      {path:[RoutePath.courses,RoutePath.editCourse], label: 'Edit Course', icon: <EditOutlined /> },
    ]
  };
  
const teachers= {
    path: [],
    label: 'Teachers',
    icon: <AlibabaOutlined />,
    subNav: [
      {
        path: [RoutePath.teachers],
        label: 'Teacher List',
        icon: <TeamOutlined />,
        subNav: [{ path: ['bb'], label: 'Test', icon: <UpOutlined /> }],
      },
    ],
  };
  
const overview={
    path: [],
    label: 'Overview',
    icon: <PlayCircleOutlined />,
  };

export const routes = new Map([
    [userType.manager,[overview,students,teachers,courses]],
    [userType.teacher,[overview,students,courses]],
    [userType.student,[overview,courses]],
])