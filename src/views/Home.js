import React, { useState, useEffect, useContext } from 'react'

import { app } from '../config/firebase'
import {getDatabase, ref, onValue} from 'firebase/database'
import { tables } from '../config/tables'
import { Context } from '../config/Provider'

export default function Home() {
    const state = useContext(Context)
    const [products, setProducts] = useState([])
    const [allProd, setAllProd] = useState([])

    // Firebase
    const db = getDatabase(app)
    const dbref = ref(db, tables.products)

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const arr = []
                const keys = Object.keys(data)
                keys.forEach(key=> arr.push({...data[key], id: key}))
                setProducts(arr)
                setAllProd(arr)
            }else{
                setProducts([])
            }
        })
    }, [])

    const add = item => {
        if(state.cartNo === 0){
            const c = [{...item, qty: 1}]
            state.pushCart(c)
            localStorage.setItem('cart', JSON.stringify(c))
        }else{
            const findItem = state.cart.find(el=>el.id === item.id)
            if(findItem){
                const c = [...state.cart]
                const newC = c.map(el=>{
                    if(el.id === item.id){
                        el['qty'] = el['qty'] + 1
                    }
                    return el
                })
                state.pushCart(newC)
                localStorage.setItem('cart', JSON.stringify(newC))
            }else{
                const c = [...state.cart, {...item, qty: 1}]
                state.pushCart(c)
                localStorage.setItem('cart', JSON.stringify(c))
            }
        }
    }

    const prod_list = products.length > 0 ? products.map((item, index)=>(
        <div className="col-2 col-lx-3 col-l-4 col-m-6 col-s-6 padding-all-10" key={index}>
            {/* <div><img src={item.img} className="imgProd" alt="" /></div> */}
            <div className="prod-image" style={{ backgroundImage: `url(${item.img})` }} />
            <div>{item.name}</div>
            <div>${item.price.toFixed(2)}</div>
            <div><button className="add" onClick={()=>add(item)}>Add</button></div>
        </div>
    )) : <div className="col-12 padding-all-10">No product available for display</div>

    const filter = text => {
        if(text === ''){
            setProducts(allProd)
            return
        }

        const arr = []
        products.forEach(item=>{
            if(item.name.toLowerCase().indexOf(text.toLowerCase()) > -1){
                arr.push(item)
            }
        })
        setProducts(arr)
    }

  return (
    <div>
        <div className="navy-blue-bg">
            <div className="flex-row-reverse width-95 margin-auto">
                <div className="width-30 width-l-45 width-m-60 width-s-70">
                    <input placeholder="Search for a product" onChange={(e)=>filter(e.target.value)} />
                </div>
            </div>
            <br />
        </div>
        <br />
        <div className="width-95 margin-auto">
            <div className="row">{prod_list}</div>
        </div>
    </div>
  )
}
