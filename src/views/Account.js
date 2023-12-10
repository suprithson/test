import React, { useContext, useEffect, useState } from 'react'
import Auth from '../components/Auth'
import { Context } from '../config/Provider'
import { useNavigate } from 'react-router-dom'

import { FaEdit, FaTrashAlt } from 'react-icons/fa'

import { app } from '../config/firebase'
import { getDatabase, ref, set } from 'firebase/database'
import { tables } from '../config/tables'
import toast from 'react-hot-toast'

const style = {
  element: { border: '1px solid #ccc', borderRadius: 3 },
}

export default function Account() {
  const state = useContext(Context)
  const navigation = useNavigate()
  const [orders, setOrders] = useState([])
  const t_head = ['No', 'Puchase Date', 'Action'].map((item, index)=>(
    <th colSpan={item === 'Action' ? 2 : 1} key={index}>{item}</th>
  ))

  // Firebase Database
  const db = getDatabase(app)
  const dbref = ref(db, `${tables.users}/${state.info?.id ?? ''}`)

  useEffect(()=>{
    setOrders(state.info?.orders ?? [])
  }, [])

  const removeItem = index => {
    const new_o = orders.filter((item, i)=> index !== i)
    const obj = {...state.info, orders: new_o}
    set(dbref, obj)
    .then(()=>{
      state.updateInfo(obj)
      localStorage.setItem('user', JSON.stringify(obj))
      toast.success('Order item removed successfully')
      window.location.reload()
    })
    .catch(()=>{
      toast.error('Error occurred')
    })
  }

  const viewItem = index => navigation(`orders/${index}`)

  const orderList = orders.length > 0 ? orders.map((item, index)=>(
    <tr key={index}>
      <td>{index+1}</td>
      <td>{item.date}</td>
      <td><FaEdit onClick={()=>viewItem(index)} className="cursor-pointer font-20" /></td>
      <td><FaTrashAlt onClick={()=>removeItem(index)} className="cursor-pointer font-20" /></td>
    </tr>
  )) : <tr><td colSpan={4} className="center-text">No data available</td></tr>

  return (
    <Auth>
      <div>
        <div className="padding-all-20" />

        <div className="width-90 margin-auto">
          <div className="row">

            <div className="col-3 col-lx-6 col-l-8 col-m-12 col-s-12 padding-all-10">
              <div className="bold-text font-20">Account Information</div>
              <br />
              <div className="bold-text">Fullname</div>
              <div className="padding-all-10" style={style.element}>{state.info?.name ?? ''}</div>
              <br />

              <div className="bold-text">Address</div>
              <div className="padding-all-10" style={style.element}>{state.info?.address ?? ''}</div>
              <br />

              <div className="bold-text">Email</div>
              <div className="padding-all-10" style={style.element}>{state.info?.email ?? ''}</div>
            </div>

            <div className="col-9 col-lx-12 col-l-12 col-m-12 col-s-12 padding-all-10">
              <div className="width-90 width-m-100 width-s-100 margin-auto">
                <div className="bold-text font-20">Purchase List</div>
                <br />

                <table className="table bordered">
                  <thead>
                    <tr>{t_head}</tr>
                  </thead>
                  <tbody>{orderList}</tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        <div className="padding-all-20" />
      </div>
    </Auth>
  )
}
