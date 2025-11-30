import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Copy } from "lucide-react"

export default function MigratingFromV3Page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2">Migrating from V3</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Learn how to migrate from v3 to v4.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-black mb-4">What's new?</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              The CLI now initializes projects with Tailwind v4. You can find v3
              components <a href="#" className="text-primary underline">here</a>.
            </li>
            <li>
              All components are updated for Tailwind v4 and React 19.
            </li>
            <li>Removed utility class components.</li>
          </ul>
          <p className="mt-4">
            Visit <a href="#" className="text-primary underline">changelog</a> to
            see all the changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">
            1. Follow the Tailwind v4 Upgrade Guide
          </h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              Upgrade to Tailwind v4 by following the official{" "}
              <a href="#" className="text-primary underline">upgrade guide</a>
            </li>
            <li>
              Use the{" "}
              <code className="neo-border-sm bg-muted px-2 py-1 text-sm">
                @tailwindcss/upgrade
              </code>{" "}
              @next codemod to remove deprecated utility classes and update
              tailwind config.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">
            2. Upgrade your dependencies
          </h2>
          <h3 className="text-xl font-bold mb-2">Upgrade React dependencies</h3>
          <p className="mb-4">
            If you're using Next.js, you can upgrade React and React DOM to the
            latest version by running the following command:
          </p>
          <div className="neo-border-sm bg-black text-white p-4 font-mono text-sm relative">
            <code>npx @next/codemod@canary upgrade latest</code>
            <button className="absolute top-2 right-2">
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4">
            Visit{" "}
            <a href="#" className="text-primary underline">
              Next.js upgrade guide
            </a>{" "}
            for more info.
          </p>
          <p className="mt-4">
            Otherwise, you can upgrade React and React DOM to the latest version
            by running the following command:
          </p>
          <div className="neo-border-sm bg-black text-white p-4 font-mono text-sm relative">
            <code>npm install react@latest react-dom@latest</code>
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
          <Link href="/docs/installation">
            Installation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

