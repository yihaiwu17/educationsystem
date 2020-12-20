import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { userType } from '../component/userType';
import { routes } from '../lib/routes';
import { deepSearchFactory } from '../lib/deep-search';

export default function AppBreadcrumb(props) {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split('/').slice(1);
  const root = '/' + paths.slice(0, 2).join('/');
  const sub = paths.slice(2);
  const userTypes = router.pathname.split('/')[2];
  const sideNav = routes.get(userTypes);

  return (
    <Breadcrumb style={{ margin: '4px', padding: 4 }}>
      <Breadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${userTypes.toLocaleUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>

      {sub
        .map((item, index) => {
          const path = [root, ...sub.slice(0, index + 1)].join('/');
          const names = props.getSideNavNameByPath(sideNav, path);
          const breadList = names.map((name) => {
            const target = deepSearchFactory(
              (nav, value) => nav.label === value,
              name,
              'subNav'
            )(sideNav);

            return (
              <Breadcrumb.Item key={index}>
                {index === sub.length - 1 || !target.path.length ? (
                  name
                ) : (
                  <Link href={path}>{name}</Link>
                )}
              </Breadcrumb.Item>
            );
          });
          return [userType.student, userType.manager, userType.teacher].find(
            (userType) => userType === item
          )
            ? null
            : breadList;
        }, [])
        .reduce((acc, cur) => [...acc, ...cur], [])}
    </Breadcrumb>
  );
}
