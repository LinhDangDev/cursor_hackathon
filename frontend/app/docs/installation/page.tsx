import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Copy } from "lucide-react"

export default function InstallationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2">Installation</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Get started with neobrutalism components.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-black mb-4">1. Create a new project</h2>
          <p className="mb-4">
            Create a new Next.js project using the following command:
          </p>
          <div className="neo-border-sm bg-black text-white p-4 font-mono text-sm relative">
            <code>npx create-next-app@latest</code>
            <button className="absolute top-2 right-2">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">2. Install dependencies</h2>
          <p className="mb-4">Install the required dependencies:</p>
          <div className="neo-border-sm bg-black text-white p-4 font-mono text-sm relative">
            <code>npm install tailwindcss postcss autoprefixer</code>
            <button className="absolute top-2 right-2">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">3. Initialize Tailwind CSS</h2>
          <p className="mb-4">Initialize Tailwind CSS configuration:</p>
          <div className="neo-border-sm bg-black text-white p-4 font-mono text-sm relative">
            <code>npx tailwindcss init -p</code>
            <button className="absolute top-2 right-2">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      <div className="flex justify-between items-center pt-8 border-t-4 border-black">
        <Button
          variant="default"
          className="neo-blue-bg text-white"
          asChild
        >
          <Link href="/docs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Introduction
          </Link>
        </Button>
        <Button
          variant="default"
          className="neo-blue-bg text-white"
          asChild
        >
          <Link href="/docs/resources">
            Resources
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

