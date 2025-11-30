"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Languages } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onFind: (data: { hoTen: string; githubOrLinkedIn: string; type: 'github' | 'linkedin' }) => void
}

type Language = 'vi' | 'en'

const translations = {
  vi: {
    title: "Đăng nhập",
    hoTen: "Họ tên *",
    hoTenPlaceholder: "Nhập họ tên của bạn",
    selectAccount: "Chọn loại tài khoản",
    github: "GitHub",
    linkedin: "LinkedIn",
    githubUrl: "GitHub URL *",
    linkedinUrl: "LinkedIn URL *",
    githubPlaceholder: "https://github.com/username",
    linkedinPlaceholder: "https://linkedin.com/in/username",
    cancel: "Hủy",
    find: "Next",
    fillAll: "Vui lòng điền đầy đủ thông tin!",
    language: "English"
  },
  en: {
    title: "Login",
    hoTen: "Full Name *",
    hoTenPlaceholder: "Enter your full name",
    selectAccount: "Select account type",
    github: "GitHub",
    linkedin: "LinkedIn",
    githubUrl: "GitHub URL *",
    linkedinUrl: "LinkedIn URL *",
    githubPlaceholder: "https://github.com/username",
    linkedinPlaceholder: "https://linkedin.com/in/username",
    cancel: "Cancel",
    find: "Next",
    fillAll: "Please fill in all information!",
    language: "Tiếng Việt"
  }
}

export function LoginModal({ isOpen, onClose, onFind }: LoginModalProps) {
  const [formData, setFormData] = useState({
    hoTen: '',
    githubOrLinkedIn: '',
    type: 'github' as 'github' | 'linkedin'
  })
  const [language, setLanguage] = useState<Language>('vi')
  const t = translations[language]

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTypeChange = (type: 'github' | 'linkedin') => {
    setFormData(prev => ({
      ...prev,
      type: type,
      githubOrLinkedIn: ''
    }))
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.hoTen.trim() && formData.githubOrLinkedIn.trim()) {
      onFind(formData)
      setFormData({
        hoTen: '',
        githubOrLinkedIn: '',
        type: 'github'
      })
    } else {
      alert(t.fillAll)
    }
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="neo-border-sm"
                title={t.language}
              >
                <Languages className="h-4 w-4" />
              </Button>
              <button
                onClick={onClose}
                className="neo-border-sm w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="hoTen" className="text-sm font-bold">
                {t.hoTen}
              </label>
              <Input
                type="text"
                id="hoTen"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleInputChange}
                placeholder={t.hoTenPlaceholder}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">
                {t.selectAccount}
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.type === 'github' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleTypeChange('github')}
                >
                  {t.github}
                </Button>
                <Button
                  type="button"
                  variant={formData.type === 'linkedin' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleTypeChange('linkedin')}
                >
                  {t.linkedin}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="githubOrLinkedIn" className="text-sm font-bold">
                {formData.type === 'github' ? t.githubUrl : t.linkedinUrl}
              </label>
              <Input
                type="url"
                id="githubOrLinkedIn"
                name="githubOrLinkedIn"
                value={formData.githubOrLinkedIn}
                onChange={handleInputChange}
                placeholder={
                  formData.type === 'github'
                    ? t.githubPlaceholder
                    : t.linkedinPlaceholder
                }
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                {t.cancel}
              </Button>
              <Button
                type="submit"
                variant="default"
                className="flex-1"
              >
                {t.find}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

