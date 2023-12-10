import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'

import { app } from '../config/firebase'
import { getDatabase, ref, onValue, push } from 'firebase/database'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import toast from 'react-hot-toast'
import { tables } from '../config/tables'
import { Context } from '../config/Provider'

export default function AccountLogin() {
    const navigation = useNavigate()
    const contextState = useContext(Context)
    const [users, setUsers] = useState([])
    const [state, setState] = useState({name: '', address: '', email: '', password: ''})
    const [reg, setReg] = useState(false)
    const [loading, setLoading] = useState(false)
    const toggle = () => setReg(!reg)
    const onChange = obj => setState({...state, ...obj})

    // Firebase Database
    const db = getDatabase(app)
    const dbref = ref(db, tables.users)

    // Firebase Auth
    const auth = getAuth(app)

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const arr = []
                const keys = Object.keys(data)
                keys.forEach(key=> arr.push({...data[key], id: key}))
                setUsers(arr)
            }else{
                setUsers([])
            }
        })
    }, [])

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)
        if(reg){
            const {address, email, name, password} = state
            if(address && email && password && name){
                createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential=>{
                    const obj = {address, email, name}
                    push(dbref, obj)
                    .then(()=>{
                        setLoading(false)
                        toast.success('Account created!')
                        toggle()
                    })
                    .catch(()=>{
                        setLoading(false)
                        toast.error('Error occurred while saving data')
                    })
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
        }else{
            const {email, password} = state
            if(email && password){
                signInWithEmailAndPassword(auth, email, password)
                .then(userCrendential=>{
                    const findUser = users.find(item=>item.email.toLowerCase() === email.toLowerCase())
                    if(findUser){
                        contextState.updateInfo(findUser)
                        setLoading(false)
                        localStorage.setItem('user', JSON.stringify(findUser))
                        const redirectUrl = localStorage.getItem('redirect-url')
                        if(redirectUrl) navigation(redirectUrl)
                        else navigation('/account')
                    }else{
                        setLoading(false)
                        toast.error('User data was not found')
                    }
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
    }
  return (
    <div className="min-height-1001">
        <div className="padding-all-20" />
        <div className="width-30 width-lx-45 width-l-60 width-m-80 width-s-90 add-form white-bg margin-auto">
            <div 
                className="padding-all-10 center-text bold-text font-18" 
                style={{ borderBottom: '1px solid #ccc' }}
            >
                {reg ? 'Create Account' : 'Login'}
            </div>
            <br />
            <form className="padding-all-10" onSubmit={onSubmit}>
                {
                    reg
                    ?
                    <>
                        <Input 
                            value={state.name} 
                            onChange={(e)=>onChange({name: e.target.value})} 
                            type="text" 
                            placeholder="Enter fullname" />
                        <br />
                        <br />
                        <Input 
                            value={state.address} 
                            onChange={(e)=>onChange({address: e.target.value})} 
                            type="text" 
                            placeholder="Enter address" />
                        <br />
                        <br />
                    </>
                    :
                    <></>
                }
                <Input 
                    value={state.email} 
                    onChange={(e)=>onChange({email: e.target.value})} 
                    type="email" 
                    placeholder="Enter Email" />
                <br />
                <br />
                <Input 
                    value={state.password} 
                    onChange={(e)=>onChange({password: e.target.value})} 
                    type="password" 
                    placeholder="Enter password" />
                <br />
                <br />
                <div className="font-14 center-text">{reg ? 'Already have an account?' : "Don't have an account?"} <span onClick={toggle} className="cursor-pointer" style={{ borderBottom: '2px solid rgb(0, 34, 68)' }}>{reg ? 'Sign-In' : 'Sign-Up'}</span></div>
                <br />
                <Button name={reg ? 'Create Account' : 'Login'} loading={loading} />
            </form>
            <div className="padding-all-10" />
        </div>
        <div className="padding-all-20" />
    </div>
  )
}
