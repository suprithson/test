import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { getDatabase, ref, onValue } from 'firebase/database'
import { app } from '../config/firebase'
import { tables } from '../config/tables'

const style = {
    element: { border: '1px solid #ccc', borderRadius: 3 },
}

export default function AdminOrderView() {
    const { id } = useParams()
    const [total, setTotal] = useState(0)
    const [date, setDate] = useState('')
    const [detail, setDetail] = useState({})
    const [order, setOrder] = useState([])

    // Firebase Database
    const db = getDatabase(app)
    const dbref = ref(db, `${tables.orders}/${id}`)

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                setDetail(data.info)
                setOrder(data.order)
                setDate(data.date)
                setTotal(Number(data.total))
            }
        })
    }, [])

    const orderList = order.length > 0 ? order.map((item, index)=>{
        return (
            <div key={index} className="flex-row align-items-center" style={{ marginBottom: 15 }}>
                <div className="prod-d-img" style={{ backgroundImage: `url(${item.img})` }} />
                <div className="padding-all-10 width-50">
                    <div>{item.name}</div>
                    <div>Price: ${item.price.toFixed(2)}</div>
                    <div>Qty: {item.qty}</div>
                </div>
            </div>
        )
    }) : <></>

  return (
    <div>
        <div className="width-90 margin-auto">
            <div className="row">

                <div className="col-3 col-lx-5 col-l-6 col-m-12 col-s-12 padding-all-10">
                    <div className="font-20 bold-text">Customer Details</div>
                    <br />
                    <div>Name</div>
                    <div style={style.element} className="padding-all-10 white-bg">
                        {detail.name}
                    </div>
                    <br />

                    <div>Address</div>
                    <div style={style.element} className="padding-all-10 white-bg">
                        {detail.address}
                    </div>
                    <br />

                    <div>Email</div>
                    <div style={style.element} className="padding-all-10 white-bg">
                        {detail.email}
                    </div>
                </div>

                <div className="col-9 col-lx-7 col-l-12 col-m-12 col-s-12 padding-all-10">

                    <div className="font-20 bold-text">
                        {`Orders on ${date} - Total => $${total}`}
                    </div>

                    <div className="padding-all-20">
                        <div>
                            {orderList}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>
  )
}
