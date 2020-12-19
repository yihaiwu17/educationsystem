// import { memoize } from 'lodash';


export const generateKey = (data, index) => {
  return `${data.label}_${index}`;
};


// const getActiveKey = (data) => {
  
//   const activeRoute = omitDetailPath(this.props.router.pathname);
//   const { paths, keys } = memoizedGetKeyPathInfo(data);
//   const index = paths.findIndex((item) => item === activeRoute);

//   return keys[index] || '';
// };



const isDetailPath = (path) => { 
  const paths = path.split('/');
  const length = paths.length;
  const last = paths[length -1];
  const reg = /\[.*\]/;

  return reg.test(last);
}

/**
 * 忽略详情路径上的参数路径
 */
export const omitDetailPath = (path) => {
  const isDetail = isDetailPath(path);
  console.log('isDetail            ' + isDetail)

  return isDetail ? path.slice(0, path.lastIndexOf('/')) : path;
}

// const getKeyPathInfo = (data) => {
//   const getPaths = generateFactory(generatePath);
//   const userType = this.props.router.pathname.split('/')[2];
//   const paths = getPaths(data)
//     .reduce((acc, cur) => [...acc, ...cur], [])
//     .map((item) => ['/dashboard', userType, item].filter((item) => !!item).join('/'));
//   const getKeys = generateFactory(generateKey);
//   const keys = getKeys(data).reduce((acc, cur) => [...acc, ...cur], []);

//   return { keys, paths };
// };

// export const memoizedGetKeyPathInfo = memoize(getKeyPathInfo, (data) =>
//   data.map((item) => item.label).join('_')
// );



export const generatePath = (data) => {
  return data.path.join('/');
};




export const generateFactory = (fn) =>
  function inner(data, current = ''){
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

