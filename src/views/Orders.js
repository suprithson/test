import React, {useState, useContext, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { Context } from '../config/Provider'

export default function Orders() {
    const { id } = useParams()
    const state = useContext(Context)
    const [date, setDate] = useState('')
    const [order, setOrder] = useState([])

    useEffect(()=>{
        const orders = state.info?.orders ?? []
        const ord = orders[id]
        setDate(ord?.date ?? '')
        setOrder(ord?.order ?? [])
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
        <div className="padding-all-20" />
        <div className="center-text font-20 bold-text">
            {`Orders on ${date}`}
        </div>
        <br />
        <div className="padding-all-20">
            <div className="width-30 width-lx-45 width-l-60 width-m-100 width-s-100 margin-auto">
                {orderList}
            </div>
        </div>
        <div className="padding-all-20" />
    </div>
  )
}
