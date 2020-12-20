export const generateKey = (data, index) => {
  return `${data.label}_${index}`;
};

const isDetailPath = (path) => {
  const paths = path.split('/');
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

/**
 * 忽略详情路径上的参数路径
 */
export const omitDetailPath = (path) => {
  const isDetail = isDetailPath(path);
  console.log('isDetail            ' + isDetail);

  return isDetail ? path.slice(0, path.lastIndexOf('/')) : path;
};

export const generatePath = (data) => {
  return data.path.join('/');
};

export const generateFactory = (fn) =>
  function inner(data, current = '') {
    const keys = data.map((item, index) => {
      let key = fn(item, index);

      if (current) {
        key = [current, key].join('/');
      }

      if (item.subNav && !!item.subNav.length) {
        return inner(item.subNav, key).map((item) => item.join('/'));
      } else {
        return [key];
      }
    });

    return keys;
  };
