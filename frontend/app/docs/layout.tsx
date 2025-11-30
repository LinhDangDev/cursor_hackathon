"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"

const sidebarItems = [
  { href: "/docs", labelKey: "introduction" },
  { href: "/docs/terms-of-use", labelKey: "termsOfUse" },
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <div className="flex h-[calc(100vh-4rem)] pt-16">
      {/* Left Sidebar */}
      <aside className="w-64 neo-border-sm bg-background overflow-y-auto">
        <nav className="p-4 space-y-6">
          <div>
            <h3 className="text-base font-bold mb-2 px-2">
              {t.docs.gettingStarted}
            </h3>
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 text-sm font-bold neo-border-sm transition-colors ${
                        isActive
                          ? "neo-blue-bg text-white"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      {t.docs[item.labelKey as keyof typeof t.docs] as string}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 neo-border-sm neo-light-blue-bg overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}

