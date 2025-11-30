"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  matchId: string | null
  matchedUser: any | null
  commonInterests: string[]
  registerUser: (interests: string[]) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [matchId, setMatchId] = useState<string | null>(null)
  const [matchedUser, setMatchedUser] = useState<any | null>(null)
  const [commonInterests, setCommonInterests] = useState<string[]>([])
  const { user, isAuthenticated } = useAuth()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Tạo kết nối socket
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      })

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id)
        setIsConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected')
        setIsConnected(false)
      })

      newSocket.on('matched', (data: { matchId: string; matchedUser: any; commonInterests: string[] }) => {
        console.log('Matched!', data)
        setMatchId(data.matchId)
        setMatchedUser(data.matchedUser)
        setCommonInterests(data.commonInterests || [])
      })

      newSocket.on('waiting', (data: { message: string }) => {
        console.log('Waiting for match...', data)
      })

      newSocket.on('partner-disconnected', () => {
        console.log('Partner disconnected')
        setMatchId(null)
        setMatchedUser(null)
        setCommonInterests([])
      })

      setSocket(newSocket)
      socketRef.current = newSocket

      return () => {
        newSocket.close()
      }
    }
  }, [isAuthenticated, user])

  // Đăng ký user khi có interests
  const registerUser = (interests: string[]) => {
    if (socketRef.current && user) {
      const userId = user.token || `user_${Date.now()}`
      socketRef.current.emit('register', {
        userId,
        userData: {
          hoTen: user.hoTen,
          githubOrLinkedIn: user.githubOrLinkedIn,
          type: user.type
        },
        interests
      })
    }
  }

  // Expose registerUser through context
  const contextValue: SocketContextType = {
    socket,
    isConnected,
    matchId,
    matchedUser,
    commonInterests,
    registerUser
  }

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

