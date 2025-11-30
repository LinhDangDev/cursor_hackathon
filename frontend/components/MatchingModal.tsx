"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Loader2 } from "lucide-react"
import { useSocket } from "@/contexts/SocketContext"
import { useLanguage } from "@/contexts/LanguageContext"

interface MatchingModalProps {
  isOpen: boolean
  onClose: () => void
  onMatched: () => void
}

export function MatchingModal({ isOpen, onClose, onMatched }: MatchingModalProps) {
  const { socket, isConnected, matchId, matchedUser, registerUser } = useSocket()
  const { t } = useLanguage()
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (isOpen && socket && isConnected) {
      setIsSearching(true)
      // Lấy interests từ localStorage và đăng ký lại
      const savedInterests = localStorage.getItem('user_interests')
      if (savedInterests) {
        try {
          const interests = JSON.parse(savedInterests)
          // Đăng ký lại với socket để tìm kiếm
          setTimeout(() => {
            registerUser(interests)
          }, 300)
        } catch (error) {
          console.error('Error parsing interests:', error)
        }
      }
    }
  }, [isOpen, socket, isConnected, registerUser])

  useEffect(() => {
    if (matchId && matchedUser) {
      // Khi có match, đóng modal và chuyển đến chat
      setIsSearching(false)
      onMatched()
    }
  }, [matchId, matchedUser, onMatched])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="neo-border-lg bg-background w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-black">
            {t.matching?.title || "Đang tìm kiếm"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg font-bold text-center">
              {t.matching?.pending || "Đang tìm người để matching..."}
            </p>
            {!isConnected && (
              <p className="text-sm text-muted-foreground mt-2">
                {t.matching?.connecting || "Đang kết nối..."}
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="neo-border-sm"
            >
              {t.matching?.cancel || "Hủy"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

