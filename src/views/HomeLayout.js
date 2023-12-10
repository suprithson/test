import React, {useContext} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { FaShoppingBag, FaUserAlt, FaPowerOff } from "react-icons/fa";
import { Context } from '../config/Provider';
import toast from 'react-hot-toast'

export default function HomeLayout() {
    const state = useContext(Context)
    const navigation = useNavigate()
    const cart = () => {
        if(state.cartNo > 0) navigation('/cart')
        else toast.error('Cart is empty')
    }
    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('redirect-url')
        state.updateInfo(null)
        navigation('/account-login')
    }
  return (
    <div>
        <div className="padding-all-10 navy-blue-bg">
            <div className="width-95 margin-auto">
                <div className="flex-row justify-content-space-between">
                    <div 
                        className="white-text bold-text cursor-pointer"
                        onClick={()=>navigation('/')}
                    >
                        {state.appName}
                    </div>
                    <div>
                        <span onClick={()=>navigation('/account')} className="white-text cursor-pointer yellow-hover" title="Account" style={{ marginRight: 20 }}><FaUserAlt /></span>
                        <span onClick={cart} className="white-text cursor-pointer yellow-hover" title="Cart" style={{ marginRight: 20 }}><FaShoppingBag /> {state.cartNo}</span>
                        {state?.info ? <span onClick={logout} className="white-text cursor-pointer yellow-hover" title="Logout"><FaPowerOff /></span> : <></>}
                    </div>
                </div>
            </div>
        </div>
        <Outlet />
        <div className="padding-all-20" />
    </div>
  )
}
