import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function FigmaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2">Figma</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Figma design files for neobrutalism components.
        </p>
      </div>

      <div className="space-y-6">
        <p>Figma files coming soon...</p>
      </div>

      <div className="flex justify-between items-center pt-8 border-t-4 border-black">
        <Button
          variant="default"
          className="neo-blue-bg text-white"
          asChild
        >
          <Link href="/docs/resources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Resources
          </Link>
        </Button>
        <Button
          variant="default"
          className="neo-blue-bg text-white"
          asChild
        >
          <Link href="/docs/changelog">
            Changelog
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

