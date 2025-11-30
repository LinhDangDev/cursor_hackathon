"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function DocsPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black mb-2">{t.docs.introTitle}</h1>
        <p className="text-lg text-muted-foreground mb-6">
          {t.docs.introSubtitle}
        </p>
      </div>

      <div className="space-y-4 text-base">
        <p>
          {t.docs.introText1}{" "}
          <a
            href="https://ui.shadcn.com"
            className="text-primary underline hover:no-underline"
          >
            Shadcn UI
          </a>
          .
        </p>

        <p>{t.docs.introText2}</p>

        <p>{t.docs.introText3}</p>
      </div>

      <div className="flex justify-end items-center pt-8 border-t-4 border-black">
        <Button
          variant="default"
          className="neo-blue-bg text-white"
          asChild
        >
          <Link href="/docs/terms-of-use">
            {t.docs.termsOfUse}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

