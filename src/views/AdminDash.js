import React from 'react'
import { useNavigate } from 'react-router-dom'

const menu = [
    {name: 'Products', link: '/admin/products'},
    {name: 'Orders', link: '/admin/orders'},
]

export default function AdminDash() {
    const navigation = useNavigate()
    
    const menuList = menu.map((item, index)=>(
        <React.Fragment key={index}>
            <div className="menu-button" onClick={()=>navigation(item.link)}>
                {item.name.toUpperCase()}
            </div>
            <br />
        </React.Fragment>
    ))
  return (
    <div>
        <div className="width-20 width-lx-30 width-l-40 width-m-50 width-s-90 margin-auto">
            <div className="">
                {menuList}
            </div>
        </div>
    </div>
  )
}
