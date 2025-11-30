"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  hoTen: string
  githubOrLinkedIn: string
  type: 'github' | 'linkedin'
  token?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'qna_auth_token'
const USER_KEY = 'qna_user_data'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Kiểm tra token và user data khi app load
    const checkAuth = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEY)
        const userData = localStorage.getItem(USER_KEY)
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error loading auth data:', error)
        // Nếu có lỗi, xóa data cũ
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }

    checkAuth()
  }, [])

  const login = (userData: User) => {
    // Tạo token đơn giản (trong production nên dùng JWT từ server)
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const userWithToken = { ...userData, token }
    
    // Lưu vào localStorage
    localStorage.setItem(STORAGE_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userWithToken))
    
    setUser(userWithToken)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

