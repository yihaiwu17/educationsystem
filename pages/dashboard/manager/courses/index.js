import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, List } from 'antd';

import AppLayout from '../../../../component/Layout';
import { coursesDetailApi } from '../../../../services/apiService';

export default function CoursesPage() {

  const [courseInfo,setCourseInfo] = useState([])
  const [paginator,setPaginator] = useState({limit:20,page:1})
  const [hasMore,setHasMore] = useState(true)

  useEffect(()=>{
    coursesDetailApi(paginator).then((res)=>{
      console.log(res)
      const total = res.data.data.total
      const data = res.data.data.courses
      const source = [...data]

      setCourseInfo(source)

    })
  },[paginator])

  return (
    <AppLayout>
      {/* <InfiniteScroll
        dataLength={items.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="contentLayout"
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      > */}
        <List
            dataSource={courseInfo}
            renderItem={item => (
              <List.Item key={item.id}>
                <div>{item.name}</div>
              </List.Item>
            )}
          >
          </List>
      {/* </InfiniteScroll> */}
    </AppLayout>
  );
}
