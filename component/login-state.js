import Router from 'next/router';
import { useEffect } from 'react';
import {storage, userInfo} from '../services/storage';

export function useLoginState(){
    useEffect(()=>{
        if(!storage.token){
            console.log(storage.token)
            Router.push('/',undefined,{shallow:true})
        }

        if(!!storage.userType){
            console.log(storage.userType)
            Router.push(`/dashboard/${storage.userType}`,undefined,{shallow:true})

        }
    },[])

    return storage.userInfo
}
