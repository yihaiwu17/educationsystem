import { Dropdown, Menu } from "antd";
import { LogoutOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import {logout} from '../../services/apiService'
import storage from "../../services/storage";
import { useUserRole } from "../login-state";
import {HeaderIcon} from '../message/messagePanel'
import { useEffect, useState } from "react";
import {userType} from '../userType'
import {getProfileByUserId} from '../../services/apiService'
import Avatar from "antd/lib/avatar/avatar";
import Link from 'next/link';

export default function UserIcon(){
    const router = useRouter()
    const onLogout = async () => {
        const {data: isLogout} = await logout()

        if(isLogout){
            storage.deleteUserInfo()
            router.push('/login')
        }
    }

    const userRole = useUserRole()
    const [avatar, setAvatar] = useState('')

    useEffect(() => {
        if(storage.userType === userType.student || storage.userType === userType.teacher){
            getProfileByUserId(storage.userId).then((res) => {
                const {data} = res
                console.log()
                setAvatar(data?.avatar)
            })
        }
    },[])

    return(
        <HeaderIcon style={{marginLeft:'2em'}}>
            <Dropdown
                overlay={
                    <Menu>
                        {userRole !== 'manager' && (
                            <Menu.Item>
                                <ProfileOutlined />
                                <Link href={`/dashboard/${storage.userType}/profile`}>
                                    <span>Profile</span>
                                </Link>
                            </Menu.Item>
                        )}
                        <Menu.Item onClick={onLogout}>
                            <LogoutOutlined></LogoutOutlined>
                            <span>Logout</span>
                        </Menu.Item>
                    </Menu>
                }
                placement='bottomLeft'
            >

                {avatar ? <Avatar src={avatar}></Avatar> : <Avatar icon={<UserOutlined></UserOutlined>}></Avatar>}
            </Dropdown>
        </HeaderIcon>
    )
}