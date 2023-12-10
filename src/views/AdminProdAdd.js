import React, { useState } from 'react'

import { app } from '../config/firebase'
import { getDatabase, ref, push } from 'firebase/database'
import { getStorage, getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage'
import { tables } from '../config/tables'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'

export default function AdminProdAdd() {
    const [state, setState] = useState({name: '', price: 0})
    const [img, setImg] = useState(null)
    const [loading, setLoading] = useState(false)
    const onChange = obj => setState({...state, ...obj})

    // Firebase Database
    const db = getDatabase(app)
    const dbref = ref(db, tables.products)

    // Firebase Storage
    const storage = getStorage(app)

    const onFile = e => {
        const file = e.target.files[0]
        if(!file) return
        console.log(file)
        setImg(file)
    }

    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        if(img){
            const {name, price} = state
            if(name && price){
                const rand = Math.floor(Math.random() * 1000000000)
                const storage_Ref = storageRef(storage, `shop-images/image${rand}`)

                uploadBytes(storage_Ref, img).then((snapshot)=>{
                    getDownloadURL(snapshot.ref).then(url=>{
                        const pObj = {name, price: Number(price), img: url}
                        
                        push(dbref, pObj).then(()=>{
                            setLoading(false)
                            toast.success('Product added successfully')
                        })
                        .catch(err=>{
                            setLoading(false)
                            toast.success('Failed to add product')
                        })
                    })
                })
            }else{
                setLoading(false)
                toast.error('All the fields are required')
            }
        }else{
            setLoading(false)
            toast.error('Product image is required')
        }
    }
  return (
    <div>
        <div className="width-40 width-lx-45 width-l-60 width-m-80 width-s-90 margin-auto add-form white-bg">
            <div 
                className="bold-text font-20 center-text uppercase padding-all-10"
                style={{ borderBottom: '1px solid #ccc' }}
            >
                Add New Product
            </div>
            <br />

            <form className="padding-all-10" onSubmit={onSubmit}>
                <div>
                    <label className="bold-text">Product Name</label>
                    <Input 
                        onChange={(e)=>onChange({name: e.target.value})}
                        type="text"
                        value={state.name}
                        placeholder='Product Name'
                    />
                </div>
                <br />
                <div>
                    <label className="bold-text">Price</label>
                    <Input 
                        onChange={(e)=>onChange({price: e.target.value})}
                        type="number"
                        value={state.price}
                        placeholder='Product Name'
                        min={0}
                    />
                </div>
                <br />
                <div>
                    <label className="bold-text">Product Image</label>
                    <input 
                        onChange={onFile}
                        type="file"
                    />
                </div>
                <br />
                <Button name="Add Product" loading={loading} />
            </form>
            <br />
        </div>
    </div>
  )
}
