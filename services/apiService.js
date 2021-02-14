import axios from 'axios';
import { firstPaths, secondPaths, createUrl } from './path';
import errorHandler from './errorCall';
import storage from '../services/storage'


const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api';
  } else {
    return 'https://cms.chtoma.com/api';
  }
};
const baseURL = getBaseUrl();


export const axiosApi = axios.create({
  withCredentials: true,
  baseURL,
  responseType: 'json',
});

axiosApi.interceptors.request.use((config) => {

  if(config.url.includes('login') || config.url.includes('message') || config.url.includes('class')){
    return{
      ...config,
      baseURL:'https://cms.chtoma.com/api',
      headers:{
      ...config.headers,
      Authorization:'Bearer ' + storage?.token,
      }
    }

  }
  return config
})



export const studentApi = async (params) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.students, params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const deleteStudentApi = async (params) => {
  const res = await axiosApi
    .delete(createUrl(firstPaths.students+"/"+secondPaths.delete, params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const addStudentApi = async (params) => {
  const res = await axiosApi
    .post(createUrl(firstPaths.students+"/"+secondPaths.add, params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const updateStudentApi = async (params) => {
  const res = await axiosApi
    .post(createUrl(firstPaths.students+"/"+secondPaths.update, params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const studentDetailApi = async (id) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.student,{id}))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const coursesDetailApi = async (params) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.courses,params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const courseDetailApi = async (id) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.course,{id}))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const teachersApi = async (params) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.teachers,params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const courseTypeApi = async () => {
  const res = await axiosApi
    .get(createUrl(firstPaths.course+"/"+secondPaths.type))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const courseCodeApi = async () => {
  const res = await axiosApi
    .get(createUrl(firstPaths.course+"/"+secondPaths.code))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const addCourseApi = async (req) => {
  const res = await axiosApi
    .post(firstPaths.courses+"/"+secondPaths.add, req)
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const updateCourseApi = async (req) => {
  const res = await axiosApi
    .post(firstPaths.courses+"/"+secondPaths.update, req)
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const signUp = async (req) => {
  const res = await axiosApi
    .post(firstPaths.signUp, req)
    .then((res) => res.data)
    .catch((err) => errorHandler(err));
  return res;
};

export const updateProcessApi = async (req) => {
  const res = await axiosApi
    .post(firstPaths.courses+"/"+secondPaths.schedules, req)
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const processById = async (params) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.courses+"/"+secondPaths.schedules,params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const getStatisticsOverview = async (params) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.statistics+"/"+secondPaths.overview,params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const getStatisticsByStudent = async (params) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.statistics+"/"+secondPaths.student,params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const getStatisticsByTeacher = async (params) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.statistics+"/"+secondPaths.teacher,params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const getStatisticsByCourse = async (params) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.statistics+"/"+secondPaths.course,params))
    .then((res) => res)
    .catch((err) => errorHandler(err));
  return res;
};

export const getMessages = async (params) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.message,{...params}))
    .then((res) => res.data)
    .catch((err) => errorHandler(err));
  return res;
};


export const markAsRead = async (ids) => {
  const res = await axiosApi
    .put(firstPaths.message, {status:1,ids})
    .then((res) => res.data)
    .catch((err) => errorHandler(err));
  return res;
};

export const getMessageStatistic = async (userId) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.message + "/" + secondPaths.statistics,userId? {userId}:null))
    .then((res) => res.data)
    .catch((err) => errorHandler(err));
  return res;
};

export function messageEvent(){
  return new EventSource(`https://cms.chtoma.com/api/message/subscribe?userId=${storage.userId}`,{
    withCredentials: true,
  })
}

export const getClassSchedule = async (userId) => {
  const res = await axiosApi
    .get(createUrl(firstPaths.class + "/" + secondPaths.schedule,userId))
    .then((res) => res.data)
    .catch((err) => errorHandler(err));
  return res;
};


export const getWorld = async () => {
  return await axios.get(
    'https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json'
  );
};