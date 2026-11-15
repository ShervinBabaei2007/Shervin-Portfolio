import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-control font-medium whitespace-nowrap transition-all outline-none motion-safe:active:scale-[0.97] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-ring disabled:pointer-events-none disabled:bg-disabled-background disabled:text-disabled-text disabled:shadow-none aria-busy:cursor-progress aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary-fill text-primary-foreground hover:bg-primary-fill-hover active:bg-primary-fill-active",
        destructive:
          "bg-destructive text-background hover:bg-destructive/90 focus-visible:ring-destructive",
        outline:
          "border border-secondary-border bg-secondary-background text-foreground hover:bg-surface-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 pointer-coarse:min-h-11",
        xs: "h-6 gap-1 rounded-md px-2 text-label has-[>svg]:px-1.5 pointer-coarse:min-h-11 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5 pointer-coarse:min-h-11",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 pointer-coarse:min-h-11",
        icon: "size-9 pointer-coarse:min-h-11 pointer-coarse:min-w-11",
        "icon-xs": "size-6 rounded-md pointer-coarse:min-h-11 pointer-coarse:min-w-11 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 pointer-coarse:min-h-11 pointer-coarse:min-w-11",
        "icon-lg": "size-10 pointer-coarse:min-h-11 pointer-coarse:min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
