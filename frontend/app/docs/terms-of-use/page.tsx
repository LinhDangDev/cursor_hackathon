"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function TermsOfUsePage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2">{t.docs.termsTitle}</h1>
        <p className="text-lg text-muted-foreground mb-2">
          {t.docs.termsSubtitle}
        </p>
        <p className="text-sm text-muted-foreground">
          {t.docs.termsLastUpdated} {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-black mb-4">
            {t.docs.termsSection1Title}
          </h2>
          <p className="text-base">{t.docs.termsSection1Text}</p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">
            {t.docs.termsSection2Title}
          </h2>
          <p className="text-base">{t.docs.termsSection2Text}</p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">
            {t.docs.termsSection3Title}
          </h2>
          <p className="text-base">{t.docs.termsSection3Text}</p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">
            {t.docs.termsSection4Title}
          </h2>
          <p className="text-base">{t.docs.termsSection4Text}</p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">
            {t.docs.termsSection5Title}
          </h2>
          <p className="text-base">{t.docs.termsSection5Text}</p>
        </section>
      </div>

      <div className="flex justify-start items-center pt-8 border-t-4 border-black">
        <Button
          variant="default"
          className="neo-blue-bg text-white"
          asChild
        >
          <Link href="/docs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.docs.introduction}
          </Link>
        </Button>
      </div>
    </div>
  )
}

