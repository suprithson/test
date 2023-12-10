import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'
import toast from 'react-hot-toast'

import { app } from '../config/firebase'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export default function AdminLogin() {
    const navigation = useNavigate()
    const [state, setState] = useState({email: '', password: ''})
    const [loading, setLoading] = useState(false)
    const onChange = obj => setState({...state, ...obj})

    // Firebase Authentication
    const auth = getAuth(app)

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)
        const {email, password} = state
        if(email && password) {
            /* Create admin account*/
            // createUserWithEmailAndPassword(auth, email, password)
            // .then(userCredential=>{
            //     setLoading(false)
            //     toast.success('Account created')
            // })
            // .catch(err=>{
            //     setLoading(false)
            //     const error = err.message.split('/')[1].split(')')[0]
            //     toast.error(error)
            // })

            // Verify Admin
            signInWithEmailAndPassword(auth, email, password)
            .then(userCredential=>{
                setLoading(false)
                localStorage.setItem('shop-admin', email)
                navigation('/admin')
            })
            .catch(err=>{
                setLoading(false)
                const error = err.message.split('/')[1].split(')')[0]
                toast.error(error)
            })
        }else{
            setLoading(false)
            toast.error('All the fields are required')
        }
    }
  return (
    <div className="width-100 height-100 flex-column justify-content-center align-items-center off-white-bg">
        <div className="width-30 width-lx-40 width-l-50 width-m-80 width-s-90 padding-all-20 white-bg" style={{ borderRadius: 3 }}>
            <form onSubmit={onSubmit}>
                <div className="font-20 bold-text">Admin Login</div>
                <br />
                <Input type="email" value={state.email} onChange={e=>onChange({email: e.target.value})} placeholder="Enter email"/>
                <br />
                <br />
                <Input type="password" value={state.password} onChange={e=>onChange({password: e.target.value})} placeholder="Enter email"/>
                <br />
                <br />
                <br />
                <Button name="Login" loading={loading} />
            </form>
        </div>
    </div>
  )
}
