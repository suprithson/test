import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthAdmin({children}) {
  const navigation = useNavigate()
  useEffect(()=>{
    const user = localStorage.getItem('shop-admin')
    if(!user) {
      navigation('/admin-login')
    }
  }, [])
  return (
    <>{children}</>
  )
}
