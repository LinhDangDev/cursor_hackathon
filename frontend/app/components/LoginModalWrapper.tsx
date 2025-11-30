"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoginModal } from "@/components/LoginModal"
import { ConsentModal } from "@/components/ConsentModal"
import { RejectionModal } from "@/components/RejectionModal"
import { LoadingModal } from "@/components/LoadingModal"
import { InterestSelectionModal } from "@/components/InterestSelectionModal"
import { MatchingModal } from "@/components/MatchingModal"
import { useModal } from "@/contexts/ModalContext"
import { useAuth } from "@/contexts/AuthContext"
import { useSocket } from "@/contexts/SocketContext"

export function LoginModalWrapper() {
  const router = useRouter()
  const { modalState, setModalState, setHasConsented } = useModal()
  const { isAuthenticated, login } = useAuth()
  const { registerUser, matchId, matchedUser } = useSocket()
  const [userData, setUserData] = useState<{ hoTen: string; githubOrLinkedIn: string; type: 'github' | 'linkedin' } | null>(null)

  // Không tự động đóng modal khi đã authenticated vì user có thể mở matching từ navbar

  const handleAccept = () => {
    setHasConsented(true)
    setModalState('login')
  }

  const handleReject = () => {
    setModalState('rejection')
  }

  const handleNext = (data: { hoTen: string; githubOrLinkedIn: string; type: 'github' | 'linkedin' }) => {
    console.log('Form submitted:', data)
    // Lưu user data tạm thời
    setUserData(data)
    // Chuyển sang modal chọn sở thích
    setModalState('interests')
  }

  const handleInterestsComplete = (interests: string[]) => {
    console.log('Selected interests:', interests)
    
    if (userData) {
      // Lưu thông tin user và token (bao gồm interests)
      login({
        hoTen: userData.hoTen,
        githubOrLinkedIn: userData.githubOrLinkedIn,
        type: userData.type
      })
      
      // Lưu interests vào localStorage
      localStorage.setItem('user_interests', JSON.stringify(interests))
      
      // Hiển thị matching modal
      setModalState('matching')
      
      // Đăng ký với backend để tìm match
      setTimeout(() => {
        registerUser(interests)
      }, 500)
    }
  }

  // Khi có match, chuyển sang trang chat
  const handleMatched = () => {
    setModalState('closed')
    router.push('/chat')
  }

  useEffect(() => {
    if (matchId && matchedUser) {
      handleMatched()
    }
  }, [matchId, matchedUser])

  const handleCloseRejection = () => {
    setModalState('closed')
  }

  return (
    <>
      <ConsentModal
        isOpen={modalState === 'consent'}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      <LoginModal
        isOpen={modalState === 'login'}
        onClose={() => setModalState('closed')}
        onFind={handleNext}
      />
      <InterestSelectionModal
        isOpen={modalState === 'interests'}
        onClose={() => setModalState('login')}
        onComplete={handleInterestsComplete}
      />
      <RejectionModal
        isOpen={modalState === 'rejection'}
        onClose={handleCloseRejection}
      />
      <LoadingModal
        isOpen={modalState === 'loading'}
      />
      <MatchingModal
        isOpen={modalState === 'matching'}
        onClose={() => setModalState('closed')}
        onMatched={handleMatched}
      />
    </>
  )
}

