import React from 'react';
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

