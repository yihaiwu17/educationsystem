import axios from 'axios';
import { firstPaths, secondPaths, createUrl } from './path';
import errorHandler from './errorCall';

const axiosApi = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000/api',
  responseType: 'json',
});

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