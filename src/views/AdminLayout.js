import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { FaPowerOff, FaArchway } from "react-icons/fa";
import AuthAdmin from '../components/AuthAdmin';

export default function AdminLayout() {
    const navigation = useNavigate()
    const logout = () => {
        localStorage.removeItem('shop-admin')
        navigation('/admin-login')
    }
  return (
    <AuthAdmin>
        <div className="off-white-bg min-height-100">
            <div className="navy-blue-bg padding-all-10">
                <div className="width-95 margin-auto">
                    <div className="flex-row justify-content-space-between">
                        <div>
                            <FaArchway 
                                className="white-text font-20 cursor-pointer" 
                                title="Home"
                                onClick={()=>navigation('/admin')}
                            />
                        </div>
                        <div>
                            <FaPowerOff 
                                className="white-text font-20 cursor-pointer" 
                                title="Logout" 
                                onClick={logout}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="padding-all-20" />
            <Outlet />
            <div className="padding-all-20" />
        </div>
    </AuthAdmin>
  )
}
