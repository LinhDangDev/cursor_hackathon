"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight, Github, Wrench, Zap } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Home() {
  const { t } = useLanguage()
  return (
    <div className="relative">
      {/* Section 1: Hero - Get started */}
      <section className="h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl font-black tracking-tight">
              {t.hero.title}
              <br />
              <span className="inline-block neo-border-sm neo-blue-bg text-white px-4 py-2 mx-2 relative">
                {t.hero.neobrutalism}
                <span className="absolute -top-2 -left-2 text-2xl">✨</span>
                <span className="absolute -bottom-2 -right-2 text-2xl">✨</span>
              </span>
              {t.hero.layouts}
            </h1>
            <p className="text-xl font-bold max-w-2xl mx-auto">
              {t.hero.description}
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="text-lg">
                {t.hero.readDocs}
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Features - Mô tả */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-background">
              <CardHeader>
                <div className="w-12 h-12 neo-border-sm neo-blue-bg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{t.features.madeWithTailwind.title}</CardTitle>
                <CardDescription>
                  {t.features.madeWithTailwind.description}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="neo-blue-bg text-white">
              <CardHeader>
                <div className="w-12 h-12 neo-border-sm bg-white flex items-center justify-center mb-4">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.features.openSource.title}</CardTitle>
                <CardDescription className="text-white/90">
                  {t.features.openSource.description}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="neo-blue-bg text-white">
              <CardHeader>
                <div className="w-12 h-12 neo-border-sm bg-white flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.features.basedOnShadcn.title}</CardTitle>
                <CardDescription className="text-white/90">
                  {t.features.basedOnShadcn.description}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <div className="w-12 h-12 neo-border-sm neo-blue-bg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{t.features.customizable.title}</CardTitle>
                <CardDescription>
                  {t.features.customizable.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3: Fully customizable
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-black mb-4">{t.components.title}</h2>
              <p className="text-lg font-bold text-muted-foreground">
                {t.components.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" className="neo-blue-bg text-white border-0">{t.components.tryBlue}</Button>
              <Button variant="default" className="bg-green-500 text-white border-0">{t.components.tryGreen}</Button>
              <Button variant="default" className="bg-orange-500 text-white border-0">{t.components.tryOrange}</Button>
              <Button variant="default" className="bg-violet-500 text-white border-0">{t.components.tryViolet}</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="neo-blue-bg text-white border-0">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 neo-border-sm bg-white rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{t.components.success}</CardTitle>
                  </div>
                  <CardDescription className="text-white/90">
                    {t.components.successDescription}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="neo-blue-bg text-white border-0">
                <CardHeader>
                  <CardTitle className="text-xl mb-4">{t.components.accessible}</CardTitle>
                  <CardDescription className="text-white/90">
                    {t.components.accessibleAnswer}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-background border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-black">{t.components.buttons}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default" className="neo-blue-bg text-white border-0">{t.components.button}</Button>
                    <Button variant="default" className="neo-blue-bg text-white border-0">{t.components.button}</Button>
                    <Badge className="neo-border-sm neo-blue-bg text-white">{t.components.badge}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-black">{t.components.selectFruit}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="neo-border-sm bg-background p-3 font-bold text-base">
                    {t.components.select}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section> */}

      {/* Section 4: Loved by the community */}
      {/* <section className="h-screen flex items-center justify-center overflow-y-auto">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-black text-center mb-12">{t.testimonials.title}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="neo-light-blue-bg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 neo-border-sm bg-gray-300 rounded-full"></div>
                  <div>
                    <CardTitle className="text-lg">{t.testimonials.willis.name}</CardTitle>
                    <CardDescription>{t.testimonials.willis.role}</CardDescription>
                  </div>
                </div>
                <p className="font-bold">{t.testimonials.willis.text}</p>
              </CardHeader>
            </Card>

            <Card className="neo-light-blue-bg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 neo-border-sm bg-gray-300 rounded-full"></div>
                  <div>
                    <CardTitle className="text-lg">{t.testimonials.lillie.name}</CardTitle>
                    <CardDescription>{t.testimonials.lillie.role}</CardDescription>
                  </div>
                </div>
                <p className="font-bold">{t.testimonials.lillie.text}</p>
              </CardHeader>
            </Card>

            <Card className="neo-light-blue-bg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 neo-border-sm bg-gray-300 rounded-full"></div>
                  <div>
                    <CardTitle className="text-lg">{t.testimonials.ignacio.name}</CardTitle>
                    <CardDescription>{t.testimonials.ignacio.role}</CardDescription>
                  </div>
                </div>
                <p className="font-bold">{t.testimonials.ignacio.text}</p>
              </CardHeader>
            </Card>

            <Card className="neo-light-blue-bg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 neo-border-sm bg-gray-300 rounded-full"></div>
                  <div>
                    <CardTitle className="text-lg">{t.testimonials.megan.name}</CardTitle>
                    <CardDescription>{t.testimonials.megan.role}</CardDescription>
                  </div>
                </div>
                <p className="font-bold">{t.testimonials.megan.text}</p>
              </CardHeader>
            </Card>

            <Card className="neo-light-blue-bg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 neo-border-sm bg-gray-300 rounded-full"></div>
                  <div>
                    <CardTitle className="text-lg">{t.testimonials.caleb.name}</CardTitle>
                    <CardDescription>{t.testimonials.caleb.role}</CardDescription>
                  </div>
                </div>
                <p className="font-bold">{t.testimonials.caleb.text}</p>
              </CardHeader>
            </Card>

            <Card className="neo-light-blue-bg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 neo-border-sm bg-gray-300 rounded-full"></div>
                  <div>
                    <CardTitle className="text-lg">{t.testimonials.john.name}</CardTitle>
                    <CardDescription>{t.testimonials.john.role}</CardDescription>
                  </div>
                </div>
                <p className="font-bold">{t.testimonials.john.text}</p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Section 5: Frequently asked questions */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-12">{t.faq.title}</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <Card className="neo-blue-bg text-white">
              <CardHeader>
                <CardTitle className="text-xl">{t.faq.accessible}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="neo-blue-bg text-white">
              <CardHeader>
                <CardTitle className="text-xl">{t.faq.copyPaste}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="neo-blue-bg text-white">
              <CardHeader>
                <CardTitle className="text-xl">{t.faq.contribute}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 6: CTA - Start your project */}
      <section className="h-screen flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 flex-1 flex items-center justify-center">
          <div className="neo-grid-bg neo-blue-bg py-20 rounded-lg w-full">
            <div className="text-center space-y-8">
              <h2 className="text-5xl md:text-6xl font-black text-white">
                {t.cta.title}
              </h2>
              <Button size="lg" variant="secondary" className="bg-white text-primary text-lg">
                {t.cta.readDocs}
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="border-t-4 border-black bg-background py-6 w-full">
          <div className="container mx-auto px-4 text-center">
            <p className="font-bold">
              {t.footer.text}{" "}
              <a href="https://github.com/LinhDangDev/cursor_hackathon.git" className="underline hover:no-underline">{t.footer.github}</a>.
            </p>
          </div>
        </footer>
      </section>
    </div>
  )
}
