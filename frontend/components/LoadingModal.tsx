"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Languages } from "lucide-react"

interface LoadingModalProps {
  isOpen: boolean
}

type Language = 'vi' | 'en'

const translations = {
  vi: {
    title: "Đang tìm kiếm",
    message: "Đang tìm kiếm người phù hợp với bạn...",
    language: "English"
  },
  en: {
    title: "Searching",
    message: "Finding a match for you...",
    language: "Tiếng Việt"
  }
}

export function LoadingModal({ isOpen }: LoadingModalProps) {
  const [language, setLanguage] = useState<Language>('vi')
  const t = translations[language]

  if (!isOpen) return null

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi')
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card 
        className="w-full max-w-md neo-border-sm bg-background relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.title}</CardTitle>
            <button
              onClick={toggleLanguage}
              className="neo-border-sm w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors"
              title={t.language}
            >
              <Languages className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-secondary border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-8 border-4 border-accent border-t-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
              </div>
            </div>
            <p className="text-base font-bold leading-relaxed">
              {t.message}
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

