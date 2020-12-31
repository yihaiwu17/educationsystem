import { courseDetailApi } from '../../../../services/apiService';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CourseView from '../../../../component/courseView';
import AppLayout from '../../../../component/Layout'

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
    },[])

    return(
      <AppLayout>
     
      </AppLayout>

    )
}