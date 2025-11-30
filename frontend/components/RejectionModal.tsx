"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Languages, XCircle } from "lucide-react"

interface RejectionModalProps {
  isOpen: boolean
  onClose: () => void
}

type Language = 'vi' | 'en'

const translations = {
  vi: {
    title: "Thông báo",
    message: "Xin lỗi bạn, chúng mình không phù hợp để bạn sử dụng rồi",
    close: "Đóng",
    language: "English"
  },
  en: {
    title: "Notification",
    message: "Sorry, we are not suitable for you to use",
    close: "Close",
    language: "Tiếng Việt"
  }
}

export function RejectionModal({ isOpen, onClose }: RejectionModalProps) {
  const [language, setLanguage] = useState<Language>('vi')
  const t = translations[language]

  if (!isOpen) return null

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi')
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md neo-border-sm bg-background relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="neo-border-sm"
              title={t.language}
            >
              <Languages className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="neo-border-sm bg-background p-2 rounded-lg">
                <img
                  src="https://2sao.vietnamnetjsc.vn/images/2017/06/07/14/43/Meo-danh-may-AVA.gif?width=0&s=58fT-o0uhaMvBBGDjZD-2g"
                  alt="Cat typing on keyboard meme"
                  className="w-56 h-auto rounded"
                  onError={(e) => {
                    // Fallback với URL khác nếu ảnh không load được
                    const target = e.target as HTMLImageElement
                    target.src = "https://2sao.vietnamnetjsc.vn/images/2017/06/07/14/43/Meo-danh-may-AVA.gif?width=0&s=58fT-o0uhaMvBBGDjZD-2g"
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="neo-border-sm neo-blue-bg w-16 h-16 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-base font-bold leading-relaxed">
              {t.message}
            </p>
            <Button
              variant="default"
              className="w-full"
              onClick={onClose}
            >
              {t.close}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

