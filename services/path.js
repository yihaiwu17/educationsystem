export const firstPaths = {
  login: 'login',
  logout: 'logout',
  students: 'students',
  users: 'users',
  student:'student',
  courses:'courses',
  course:'course',
  teachers:'teachers',
  statistics:'statistics',
  message : 'message',
  class:'class',
  signUp:'signup', 
};

export const secondPaths = {
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  update:'update',
  type:'type',
  code:'code',
  schedules:'schedules',
  overview:'overview',
  student:'student',
  teacher:'teacher',
  course:'course',
  statistics: 'statistics',
  schedule: 'schedule',
};

export const createUrl = (paths, params) => {
  paths = typeof paths === 'string' ? paths : paths.join('/');
  let queryParams = '';

  if (!!params) {
    queryParams = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return paths + '?' + queryParams;
  }

  return paths;
};
