"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Moon, LogIn, LogOut } from "lucide-react"
import { useModal } from "@/contexts/ModalContext"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"

export function Navbar() {
  const { openLogin, openMatching } = useModal()
  const { isAuthenticated, logout, user } = useAuth()
  const { language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  // Ẩn navbar trên trang chat
  if (pathname === '/chat') {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en')
  }

  return (
    <nav className="neo-border-sm bg-background fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="neo-border-sm w-12 h-12 neo-blue-bg flex items-center justify-center text-white font-bold text-lg">
                DTH
              </div>
              <span className="hidden sm:inline text-lg font-black text-foreground">
                Dating Techub
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="/docs" 
                className="text-base font-bold text-foreground hover:underline"
              >
                Docs
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="neo-border-sm bg-background px-3 py-2 flex items-center gap-2 text-sm font-bold">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Q</span>
              <span className="hidden sm:inline">Search</span>
              <span className="hidden sm:inline text-muted-foreground">⌘K</span>
            </div>
           
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  className="neo-border-sm"
                  onClick={openMatching}
                >
                  <span className="hidden sm:inline">Xin chào, </span>
                  {user?.hoTen || 'User'}
                </Button>
                <Button
                  variant="outline"
                  className="neo-border-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="neo-border-sm"
                onClick={openLogin}
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="neo-border-sm font-bold"
              onClick={toggleLanguage}
            >
              {language === 'en' ? 'EN' : 'VI'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="neo-border-sm"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
