import { useEffect, useState } from 'react'
import { AuthContext } from './auth-context'
import { api } from '../api/client'

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth)

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth))
    } else {
      localStorage.removeItem('auth')
    }
  }, [auth])

  async function login(email, password) {
    const result = await api.post('/auth/login', { email, password })
    setAuth(result)
    return result
  }

  async function register(name, email, password) {
    await api.post('/auth/register', { name, email, password })
    return login(email, password)
  }

  function logout() {
    setAuth(null)
  }

  const value = {
    user: auth?.user ?? null,
    token: auth?.token ?? null,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
