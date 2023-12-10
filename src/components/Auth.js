import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Auth({children}) {
  const navigation = useNavigate()
  useEffect(()=>{
    const user = localStorage.getItem('user')
    if(!user) {
      navigation('/account-login')
    }
  }, [])
  return (
    <>{children}</>
  )
}
