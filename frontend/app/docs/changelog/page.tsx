import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2">Changelog</h1>
        <p className="text-lg text-muted-foreground mb-6">
          All notable changes to this project will be documented here.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-black mb-4">Version 4.0.0</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Upgraded to Tailwind CSS v4</li>
            <li>Updated all components for React 19</li>
            <li>Removed utility class components</li>
          </ul>
        </section>
      </div>

      <div className="flex justify-start items-center pt-8 border-t-4 border-black">
        <Button
          variant="default"
          className="neo-blue-bg text-white"
          asChild
        >
          <Link href="/docs/figma">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Figma
          </Link>
        </Button>
      </div>
    </div>
  )
}

