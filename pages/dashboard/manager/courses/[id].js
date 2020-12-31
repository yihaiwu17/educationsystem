import { courseDetailApi } from '../../../../services/apiService';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CourseView from '../../../../component/courseView';
import AppLayout from '../../../../component/Layout'
import { Row,Col } from 'antd';

export async function getServerSideProps(context){
    const {id} = context.params
  
    return{
      props:{id}
    }
  }
  

export default function CourseDetail() {
    const router = useRouter();
    const[info,setInfo] = useState([])

    useEffect(async()=>{
        const id = router.query.id || props.id;
        const courseDetail = await courseDetailApi(id)
        console.log(courseDetail)
        const info = courseDetail.data.data.courseData
        setInfo(info)
    },[])

    return(
      <AppLayout>
        <Row span={8}>
          <Col>
            <CourseView {...info}></CourseView>
          </Col>
        </Row>
        
      </AppLayout>

    )
}