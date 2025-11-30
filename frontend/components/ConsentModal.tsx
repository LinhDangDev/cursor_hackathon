"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Languages } from "lucide-react"

interface ConsentModalProps {
  isOpen: boolean
  onAccept: () => void
  onReject: () => void
}

type Language = 'vi' | 'en'

const translations = {
  vi: {
    title: "Xác nhận đồng ý",
    question: "Bạn có chấp nhận cho chúng mình sử dụng thông tin của bạn trong cuộc thi này không?",
    accept: "Đồng ý",
    reject: "Không đồng ý",
    language: "English"
  },
  en: {
    title: "Consent Confirmation",
    question: "Do you agree to let us use your information in this competition?",
    accept: "Accept",
    reject: "Decline",
    language: "Tiếng Việt"
  }
}

export function ConsentModal({ isOpen, onAccept, onReject }: ConsentModalProps) {
  const [language, setLanguage] = useState<Language>('vi')
  const t = translations[language]

  if (!isOpen) return null

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi')
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.stopPropagation()}
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
          <div className="space-y-6">
            <p className="text-base font-bold leading-relaxed">
              {t.question}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onReject}
              >
                {t.reject}
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={onAccept}
              >
                {t.accept}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

