import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { app } from '../config/firebase'
import { getDatabase, ref, onValue, set } from 'firebase/database'
import { tables } from '../config/tables'

import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const navigation = useNavigate()
  const [orders, setOrders] = useState([])

  // Firebase Database
  const db = getDatabase(app)
  const dbref = ref(db, tables.orders)

  const t_head = ['No', 'Puchase Date', 'Action'].map((item, index)=>(
    <th colSpan={item === 'Action' ? 2 : 1} key={index}>{item}</th>
  ))

  useEffect(()=>{
    onValue(dbref, snapshot=>{
      if(snapshot.exists()){
        const data = snapshot.val()
        const keys = Object.keys(data)
        const arr = []
        keys.forEach(key=> arr.push({...data[key], id: key}))
        setOrders(arr)
      }else{
        setOrders([])
      }
    })
  }, [])

  const viewItem = id => navigation(id)

  const removeItem = id => {
    const delRef = ref(db, `${tables.orders}/${id}`)
    set(delRef, null)
    .then(()=>{
      toast.success('Order item removed successfully')
    })
    .catch(()=>{
      toast.error('Error occurred')
    })
  }

  const orderList = orders.length > 0 ? orders.map((item, index)=>(
    <tr key={index}>
      <td>{index+1}</td>
      <td>{item.date}</td>
      <td><FaEdit onClick={()=>viewItem(item.id)} className="cursor-pointer font-20" /></td>
      <td><FaTrashAlt onClick={()=>removeItem(item.id)} className="cursor-pointer font-20" /></td>
    </tr>
  )) : <tr><td colSpan={4} className="center-text">No data available</td></tr>

  return (
    <div>
      <div className="width-50 width-lx-60 width-l-70 width-m-100 width-s-100 margin-auto">
        <div className="bold-text font-20">Order List</div>
        <br />
        <table className="table bordered white-bg">
          <thead>
            <tr>{t_head}</tr>
          </thead>
          <tbody>{orderList}</tbody>
        </table>
      </div>
    </div>
  )
}
