import React, {useState, useEffect, useContext} from 'react'
import { Context } from '../config/Provider'
import { FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { app } from '../config/firebase';
import { getDatabase, ref, set, push } from 'firebase/database';
import { tables } from '../config/tables';
import Button from '../components/Button';

export default function Cart() {
    const state = useContext(Context)
    const navigation = useNavigate()
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(false)
    const [pay, setPay] = useState(false)
    const toggle = () => setPay(!pay)

    // Firebase Database
    const db = getDatabase(app)
    const userRef = ref(db, `${tables.users}/${state?.info?.id}`)
    const dbref = ref(db, tables.orders)

    useEffect(()=>{
    }, [])

    const plus = id => {
        const c = [...state.cart]
        const new_c = c.map(item=>{
            if(item.id === id){
                item['qty'] = item['qty'] + 1
            }
            return item
        })
        state.pushCart(new_c)
        localStorage.setItem('cart', JSON.stringify(new_c))
    }

    const minus = id => {
        const findItem = state.cart.find(item=>item.id === id)
        if(findItem['qty'] - 1 === 0){
            const f = state.cart.filter(item=>item.id !== id)
            state.pushCart(f)
            localStorage.setItem('cart', JSON.stringify(f))
            if(f.length === 0) navigation('/')
        }else{
            const c = [...state.cart]
            const new_c = c.map(item=>{
                if(item.id === id){
                    item['qty'] = item['qty'] - 1
                }
                return item
            })
            state.pushCart(new_c)
            localStorage.setItem('cart', JSON.stringify(new_c))
        }
    }

    const cartList = state.cart.length > 0 ? state.cart.map((item, index)=>{
        return (
            <div key={index} className="flex-row align-items-center" style={{ marginBottom: 15 }}>
                <div className="prod-d-img" style={{ backgroundImage: `url(${item.img})` }} />
                <div className="padding-all-10 width-50">
                    <div>{item.name}</div>
                    <div>${item.price.toFixed(2)}</div>
                </div>
                <div className="padding-all-10">
                    <div className="flex-row align-items-center">
                        <div className="font-20" style={{ marginRight:10 }}>
                            <FaMinusSquare onClick={()=>minus(item.id)} className="cursor-pointer" />
                        </div>
                        <div className="font-20" style={{ marginRight:10 }}>{item.qty}</div>
                        <div className="font-20">
                            <FaPlusSquare onClick={()=>plus(item.id)} className="cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }) : <></>

    const submit = async(e) => {
        e.preventDefault()
        setLoading(true)

        const order = {
            info: {
                name: state?.info?.name, 
                email: state?.info?.email, 
                address: state?.info?.address
            }, 
            order: state.cart, total: state.total,
            date: new Date().toLocaleDateString(),
        }
        // push it to the order database
        let pOrder = {date: order.date, order: order.order, total: order.total}
        let infoOrder = state.info?.orders ?? []
        infoOrder = [...infoOrder, pOrder]

        push(dbref, order)
        .then(()=>{
            const userObj = {...state.info, orders: infoOrder}
            set(userRef, userObj)
            .then(()=>{
                state.updateInfo(userObj)
                localStorage.removeItem('cart')
                localStorage.setItem('user', userObj)
                setLoading(false)
                toast.success('Payment record saved sucsessfully')
                state.pushCart([])
                navigation('/')
            })
            .catch(()=>{
                setLoading(false)
                toast.error('Failed to order info for customer')
            })
        })
        .catch(()=>{
            setLoading(false)
            toast.error('Failed to store shopping info in database')
        })

    }

    const goToSignIn = () => {
        localStorage.setItem('redirect-url', '/cart')
        navigation('/account-login')
    }

  return (
    <div>
        <div className="padding-all-20" />
        <div className="width-90 margin-auto">
            <div className="row">
                <div className="col-8 col-l-12 col-m-12 col-s-12">
                    <div className="bold-text font-20">Cart Items</div>
                    <br />
                    {cartList}
                </div>

                <div className="col-1 col-l-12 col-m-12 col-s-12"></div>

                <div className="col-3 col-l-12 col-m-12 col-s-12">
                    <div className="cart-details">
                        <div 
                            className="padding-all-10 center-text bold-text font-20 uppercase" 
                            style={{ borderBottom: '1px solid #ccc' }}
                        >
                            Cart Details
                        </div>
                        <div className="padding-all-10">
                            <div className="flex-row justify-content-space-between">
                                <div>SubTotal </div>
                                <div>${state.total}</div>
                            </div>
                            <br />
                            <hr />
                            <br />
                            <div className="flex-row justify-content-space-between">
                                <div>Total </div>
                                <div>${state.total}</div>
                            </div>
                        </div>
                        <div className="padding-all-10">
                            {
                                pay
                                ?
                                <>
                                    {
                                        state.info
                                        ?
                                        <>
                                            <br />
                                            <form onSubmit={submit}>
                                                <div className="font-20 bold-text">Payment Form</div>
                                                <br />
                                                <div 
                                                    className="padding-all-10" 
                                                    style={{ border: '1px solid #ccc', borderRadius: 3, marginBottom: 10 }}
                                                >
                                                    {state.info.name}
                                                </div>
                                                <div 
                                                    className="padding-all-10" 
                                                    style={{ border: '1px solid #ccc', borderRadius: 3, marginBottom: 10 }}
                                                >
                                                    {state.info.address}
                                                </div>
                                                <div 
                                                    className="padding-all-10" 
                                                    style={{ border: '1px solid #ccc', borderRadius: 3, marginBottom: 10 }}
                                                >
                                                    {state.info.email}
                                                </div>
                                                <br />
                                                <Button name="Pay" loading={loading} />
                                            </form>
                                        </>
                                        :
                                        <>
                                            <div>You need to sign in to continue.</div>
                                            <div>
                                                <span 
                                                    onClick={goToSignIn}
                                                    className="cursor-pointer red-hover"
                                                    style={{ borderBottom: '2px solid rgb(0, 34, 68)'}}
                                                >
                                                    Sign in
                                                </span>
                                            </div>
                                        </>
                                    }
                                </>
                                :
                                <>
                                <br />
                                <button onClick={toggle} className="red-bg white-text width-100">Checkout</button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="padding-all-20" />
    </div>
  )
}
