"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Languages, X } from "lucide-react"

interface InterestSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (interests: string[]) => void
}

type Language = 'vi' | 'en'

const translations = {
  vi: {
    title: "Chọn sở thích của bạn",
    subtitle: "Chọn các công nghệ và lĩnh vực bạn quan tâm (có thể chọn nhiều)",
    complete: "Hoàn thành",
    cancel: "Hủy",
    language: "English"
  },
  en: {
    title: "Select Your Interests",
    subtitle: "Choose technologies and fields you're interested in (multiple selections allowed)",
    complete: "Complete",
    cancel: "Cancel",
    language: "Tiếng Việt"
  }
}

const interestCategories = {
  vi: {
    "Frontend": ["React", "Vue.js", "Angular", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "SASS/SCSS"],
    "Backend": ["Node.js", "Python", "Java", "C#", ".NET", "PHP", "Go", "Ruby"],
    "Database": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Supabase"],
    "Mobile": ["React Native", "Flutter", "Swift", "Kotlin", "Ionic"],
    "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "CI/CD", "Git", "Linux"],
    "Tools & Others": ["VS Code", "GitHub", "Figma", "Jira", "Agile", "Scrum"]
  },
  en: {
    "Frontend": ["React", "Vue.js", "Angular", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "SASS/SCSS"],
    "Backend": ["Node.js", "Python", "Java", "C#", ".NET", "PHP", "Go", "Ruby"],
    "Database": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Supabase"],
    "Mobile": ["React Native", "Flutter", "Swift", "Kotlin", "Ionic"],
    "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "CI/CD", "Git", "Linux"],
    "Tools & Others": ["VS Code", "GitHub", "Figma", "Jira", "Agile", "Scrum"]
  }
}

export function InterestSelectionModal({ isOpen, onClose, onComplete }: InterestSelectionModalProps) {
  const [language, setLanguage] = useState<Language>('vi')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const t = translations[language]
  const categories = interestCategories[language]

  if (!isOpen) return null

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi')
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest)
      } else {
        return [...prev, interest]
      }
    })
  }

  const handleComplete = () => {
    if (selectedInterests.length > 0) {
      onComplete(selectedInterests)
    } else {
      alert(language === 'vi' 
        ? 'Vui lòng chọn ít nhất một sở thích!' 
        : 'Please select at least one interest!')
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-4xl neo-border-sm bg-background relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{t.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{t.subtitle}</p>
            </div>
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
          <div className="space-y-6">
            {Object.entries(categories).map(([category, interests]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-bold border-b-2 border-foreground pb-2">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest)
                    return (
                      <Button
                        key={interest}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className={`neo-border-sm ${
                          isSelected 
                            ? 'neo-blue-bg text-white' 
                            : 'bg-background'
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-foreground">
            <div className="text-sm font-bold">
              {language === 'vi' 
                ? `Đã chọn: ${selectedInterests.length} mục`
                : `Selected: ${selectedInterests.length} items`}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="neo-border-sm"
              >
                {t.cancel}
              </Button>
              <Button
                variant="default"
                onClick={handleComplete}
                className="neo-border-sm"
                disabled={selectedInterests.length === 0}
              >
                {t.complete}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

