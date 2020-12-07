export const firstPaths = {
  login: 'login',
  logout: 'logout',
  students: 'students',
  users: 'users',
};

export const secondPaths = {
  add: 'add',
  edit: 'edit',
  delete: 'delete',
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
