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
