import { Dropdown, Menu } from "antd";
import { LogoutOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import {logout} from '../../services/apiService'
import storage from "../../services/storage";
import { useUserRole } from "../login-state";
import {HeaderIcon} from '../message/messagePanel'

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


    return(
        <HeaderIcon style={{marginLeft:'2em'}}>
            <Dropdown
                overlay={
                    <Menu>
                        {userRole !== 'manager' && (
                            <Menu.Item>
                                <ProfileOutlined />
                            </Menu.Item>
                        )}
                    </Menu>
                }
            ></Dropdown>
        </HeaderIcon>
    )
}