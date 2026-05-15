import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI, tokenStorage } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await authAPI.me()
      setUser(data)
    } catch {
      setUser(null)
      tokenStorage.clear()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tokenStorage.getAccess()) fetchMe()
    else setLoading(false)
  }, [fetchMe])

  const login = async (email, password) => {
    const { data } = await authAPI.login(email, password)
    tokenStorage.setTokens(data.access, data.refresh)
    await fetchMe()
    return data
  }

  const loginWithGoogle = async (token) => {
    const { data } = await authAPI.googleLogin(token)
    tokenStorage.setTokens(data.access, data.refresh)
    await fetchMe()
    return data
  }

  const register = async (payload) => {
    const { data } = await authAPI.register(payload)
    return data
  }

  const logout = async () => {
    try {
      await authAPI.logout(tokenStorage.getRefresh())
    } catch { /* silent */ } finally {
      tokenStorage.clear()
      setUser(null)
    }
  }

  const updateProfile = async (data) => {
    const { data: updated } = await authAPI.updateProfile(data)
    setUser(updated)
    return updated
  }

  const isAdmin        = user?.role === 'admin'
  const isAgent        = user?.role === 'agent' || user?.role === 'admin'
  const isHotelOwner   = user?.role === 'hotel_owner'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, loginWithGoogle, register, logout, updateProfile,
      isAdmin, isAgent, isHotelOwner, isAuthenticated,
      refetch: fetchMe,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}