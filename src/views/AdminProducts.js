import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getDatabase, onValue, ref, set } from 'firebase/database'
import { deleteObject, getStorage, ref as storageRef } from 'firebase/storage'
import { app } from '../config/firebase'
import { tables } from '../config/tables'
import toast from 'react-hot-toast'

import { FiTrash, FiEdit3 } from "react-icons/fi"

export default function AdminProducts() {
    const navigation = useNavigate()
    const [products, setProducts] = useState([])

    // Firebase Database
    const db = getDatabase(app)
    const dbref = ref(db, tables.products)

    // Firebase Storage
    const storage = getStorage(app)

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const arr = []
                const keys = Object.keys(data)
                keys.forEach(key => arr.push({...data[key], id: key}))
                setProducts(arr)
            }else{
                setProducts([])
            }
        })
    }, [])

    const edit = id => navigation(`/admin/product/edit/${id}`)

    const delProd = id => {
        toast.success('Delete initiated')
        const findProd = products.find(item=>item.id === id)
        if(!findProd) return
        set(ref(db, `${tables.products}/${id}`), null)
        .then(()=> {
            const deleteRef = storageRef(storage, findProd.img)
            deleteObject(deleteRef)
            .then(()=> toast.success('Product deleted successfully'))
            .catch(()=> toast.error('Product deleted but product image failed to delete'))
        })
        .catch(()=> toast.error('Error occurred while deleting product'))
    }

    const t_head = ['No', 'Name', 'Price', 'Action'].map((item, index)=>(
        <th key={index} colSpan={item === 'Action' ? 2 : 1}>{item}</th>
    ))

    const productList = products.length > 0 ? products.map((item, index)=>(
        <tr key={index}>
            <td>{index+1}</td>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td><FiEdit3 className="cursor-pointer" onClick={()=>edit(item.id)} /></td>
            <td><FiTrash className="cursor-pointer" onClick={()=>delProd(item.id)} /></td>
        </tr>
    )) : (
        <tr>
            <td colSpan="5" className="center-text">No products</td>
        </tr>
    )

  return (
    <>
        <div className="width-90 margin-auto">
            <div className="flex-row-reverse">
                <button className="add-prod" onClick={()=>navigation('/admin/addproduct')}>
                    Add Products
                </button>
            </div>
        </div>
        <br />

        <div className="width-60 width-l-80 width-m-95 width-s-100 margin-auto white-bg">
            <table className="table bordered">
                <thead><tr>{t_head}</tr></thead>
                <tbody>{productList}</tbody>
            </table>
        </div>

        <div className="padding-all-20" />
    </>
  )
}
