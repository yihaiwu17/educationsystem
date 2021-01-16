import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { List, Spin, Button } from 'antd';
import CourseView from '../../../../component/courseView';
import AppLayout from '../../../../component/Layout';
import { coursesDetailApi } from '../../../../services/apiService';
import BackToTop from '../../../../component/backToTop';
import Link from 'next/link';

export default function CoursesPage() {
  const [courseInfo, setCourseInfo] = useState([]);
  const [paginator, setPaginator] = useState({ limit: 20, page: 1 });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    coursesDetailApi(paginator).then((res) => {
      console.log(res)
      const total = res.data.data.total;
      const data = res.data.data.courses;
      const source = [...courseInfo, ...data];
      setCourseInfo(source);
      setHasMore(total > courseInfo.length);
    });
  }, [paginator]);

  return (
    <AppLayout>
      <InfiniteScroll
        dataLength={courseInfo.length} //This is important field to render the next data
        next={() => {
          setPaginator({ ...paginator, page: paginator.page + 1 });
        }}
        hasMore={hasMore}
        loader={
          <div style={{ position: 'relative', left: '50%', marginTop: 10 }}>
            <Spin size="large" />
          </div>
        }
        scrollableTarget="contentLayout"
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        style={{ overflow: 'hidden' }}
      >
        <List
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={courseInfo}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <CourseView {...item}>
                <Link href={`/dashboard/manager/courses/${item.id}`} passHref>
                  <Button type="primary">Read More</Button>
                </Link>
              </CourseView>
            </List.Item>
          )}
        ></List>
      </InfiniteScroll>
      <BackToTop />
    </AppLayout>
  );
}
