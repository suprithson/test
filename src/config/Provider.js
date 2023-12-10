import React, {useEffect, useState, createContext} from 'react'
const app_name = "ShopApp"
export const Context = createContext({
    info: null,
    appName: app_name,
    cartNo: 0,
    cart: [],
    pushCart: arr=>{},
    total: 0,
    updateInfo: obj=>{}
})

export default function Provider({children}) {
    const [appName, setAppName] = useState(app_name)
    const [info, setInfo] = useState(null)
    const [cart, setCart] = useState([])
    const [cartNo, setCartNo] = useState(0)
    const [total, setTotal] = useState(0)
    const pushCart = arr => {
        if(arr.length === 0){
            setCartNo(0)
            setCart([])
            return
        }
        let total = 0, qty = 0
        arr.forEach(item=>{
            qty += item.qty
            total += (item.qty * item.price)
        })
        setCartNo(qty)
        setCart(arr)
        setTotal(total.toFixed(2))
    }

    const updateInfo = obj => setInfo(obj)

    useEffect(()=>{
        // Get userinfo
        const u = localStorage.getItem('shopuser')
        if (u) updateInfo(JSON.parse(u))
        
        // Get cart from localStorage
        let c = localStorage.getItem('shopcart')
        if(c){
            c = JSON.parse(c)
            pushCart(c)
        }
    }, [])

  return (
    <Context.Provider 
        value={{
            appName,
            cart,
            cartNo,
            info,
            pushCart,
            total,
            updateInfo
        }}
    >
        {children}
    </Context.Provider>
  )
}
