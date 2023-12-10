import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { app } from '../config/firebase'
import { getDatabase, ref, set, onValue } from 'firebase/database'
import { getDownloadURL, uploadBytes, getStorage, ref as storageRef, deleteObject } from 'firebase/storage'
import { tables } from '../config/tables'
import toast from 'react-hot-toast'

import Button from '../components/Button'
import Input from '../components/Input'

export default function AdminProdEdit() {
    const { id } = useParams()
    const navigation = useNavigate()
    const [product, setProduct] = useState({})
    const [img, setImg] = useState(null)
    const [loading, setLoading] = useState(false)
    const onChange = obj => setProduct({...product, ...obj})

    const onFile = e => {
        const file = e.target.files[0]
        if(!file) return
        setImg(file)
    }

    // Firebase Database
    const db = getDatabase(app)
    const dbref = ref(db, `${tables.products}/${id}`)

    // Firebase Storage
    const storage = getStorage(app)

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                setProduct(data)
                console.log(data)
            }else{
                setProduct({})
            }
        })
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        if(img){
            const {name, price} = product
            if(name && price){
                const rand = Math.floor(Math.random() * 1000000000)
                const storage_Ref = storageRef(storage, `shop-images/image${rand}`)

                uploadBytes(storage_Ref, img).then((snapshot)=>{
                    getDownloadURL(snapshot.ref).then(url=>{
                        const pObj = {name, price: Number(price), img: url}
                        
                        set(dbref, pObj).then(()=>{
                            const deleteRef = storageRef(storage, product.img)
                            deleteObject(deleteRef)
                            .then(()=>{
                                setLoading(false)
                                toast.success('Product updated successfully')
                                navigation('/admin/products')
                            })
                            .catch(()=>{
                                setLoading(false)
                                toast.error('Failed to delete old image')
                                navigation('/admin/products')
                            })
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
            const {name, price} = product
            if(name && price){
                set(dbref, {...product, price: Number(product.price)})
                .then(()=>{
                    setLoading(false)
                    toast.success('Product updated successfully')
                    navigation('/admin/products')
                })
                .catch(()=>{
                    setLoading(false)
                    toast.error('Failed to update product record')
                })
            }else{
                setLoading(false)
                toast.error('All the fields are required')
            }
        }
    }
  return (
    <div>
        <div className="width-40 width-lx-45 width-l-60 width-m-80 width-s-90 margin-auto add-form white-bg">
            <div 
                className="bold-text font-20 center-text uppercase padding-all-10"
                style={{ borderBottom: '1px solid #ccc' }}
            >
                Edit Product
            </div>
            <br />

            <div className="flex-column justify-content-center align-items-center">
                <div className="prodImg">
                    {product?.img ? <img src={product.img} className="img" alt="" /> : <></>}
                </div>
            </div>
            <br />

            <form className="padding-all-10" onSubmit={onSubmit}>
                <div>
                    <label className="bold-text">Product Name</label>
                    <Input 
                        disabled={true}
                        onChange={(e)=>onChange({name: e.target.value})}
                        type="text"
                        value={product.name}
                        placeholder='Product Name'
                    />
                </div>
                <br />
                <div>
                    <label className="bold-text">Price</label>
                    <Input 
                        onChange={(e)=>onChange({price: e.target.value})}
                        type="number"
                        value={product.price}
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
                <Button name="Update Product" loading={loading} />
            </form>
            <br />
        </div>
    </div>
  )
}
