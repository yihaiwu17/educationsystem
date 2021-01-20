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
