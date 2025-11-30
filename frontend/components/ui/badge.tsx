import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-bold text-xs transition-all",
  {
    variants: {
      variant: {
        default: "neo-border-sm bg-primary text-primary-foreground",
        secondary: "neo-border-sm bg-secondary text-secondary-foreground",
        destructive: "neo-border-sm bg-destructive text-destructive-foreground",
        outline: "neo-border-sm bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
