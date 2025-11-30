"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type ModalState = 'consent' | 'login' | 'interests' | 'rejection' | 'loading' | 'matching' | 'closed'

interface ModalContextType {
  modalState: ModalState
  hasConsented: boolean
  setModalState: (state: ModalState) => void
  setHasConsented: (consented: boolean) => void
  openLogin: () => void
  openMatching: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>('closed')
  const [hasConsented, setHasConsented] = useState(false)

  useEffect(() => {
    // Kiểm tra xem đã có token chưa
    const token = localStorage.getItem('qna_auth_token')
    if (!token) {
      // Nếu chưa có token, hiển thị modal consent
      setModalState('consent')
    }
  }, [])

  const openLogin = () => {
    if (hasConsented) {
      // Nếu đã đồng ý rồi, mở trực tiếp login modal
      setModalState('login')
    } else {
      // Nếu chưa đồng ý, hiện lại consent modal
      setModalState('consent')
    }
  }

  const openMatching = () => {
    setModalState('matching')
  }

  return (
    <ModalContext.Provider
      value={{
        modalState,
        hasConsented,
        setModalState,
        setHasConsented,
        openLogin,
        openMatching,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

