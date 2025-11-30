import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { LoginModalWrapper } from "./components/LoginModalWrapper"
import { ModalProvider } from "@/contexts/ModalContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { SocketProvider } from "@/contexts/SocketContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Neobrutalism Components - shadcn/ui",
  description: "A collection of neobrutalism-styled components based on shadcn/ui",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <SocketProvider>
                <ModalProvider>
                  <Navbar />
                  <LoginModalWrapper />
                  {children}
                </ModalProvider>
              </SocketProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

