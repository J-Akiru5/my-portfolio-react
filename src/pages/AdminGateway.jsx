import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Login from './admin/Login'

/**
 * AdminGateway - Secret login page
 * 
 * Only shows login form if the secret key is provided in URL.
 * Access via: /admin/gateway?key=j-akiru-2025
 */
export default function AdminGateway() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const secretKey = import.meta.env.VITE_ADMIN_GATEWAY_KEY || 'j-akiru-2025'
  const providedKey = searchParams.get('key')

  useEffect(() => {
    // If no key or wrong key, redirect to home silently
    if (providedKey !== secretKey) {
      navigate('/', { replace: true })
    }
  }, [providedKey, secretKey, navigate])

  // Only render login if key matches
  if (providedKey !== secretKey) {
    return null
  }

  return <Login />
}
