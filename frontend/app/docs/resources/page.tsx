import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2">Resources</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Useful resources for neobrutalism components.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-black mb-4">Documentation</h2>
          <ul className="space-y-2">
            <li>
              <a href="https://ui.shadcn.com" className="text-primary underline">
                Shadcn UI Documentation
              </a>
            </li>
            <li>
              <a href="https://tailwindcss.com" className="text-primary underline">
                Tailwind CSS Documentation
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className="flex justify-between items-center pt-8 border-t-4 border-black">
        <Button
          variant="default"
          className="neo-blue-bg text-white"
          asChild
        >
          <Link href="/docs/installation">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Installation
          </Link>
        </Button>
        <Button
          variant="default"
          className="neo-blue-bg text-white"
          asChild
        >
          <Link href="/docs/figma">
            Figma
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

