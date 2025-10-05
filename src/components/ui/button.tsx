import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    let variantClass = 'bg-gradient-primary text-white hover:opacity-90 shadow-md'
    if (variant === 'outline') variantClass = 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
    if (variant === 'ghost') variantClass = 'text-primary hover:bg-primary/10'

    let sizeClass = 'px-4 py-2 text-base'
    if (size === 'sm') sizeClass = 'px-3 py-1.5 text-sm'
    if (size === 'lg') sizeClass = 'px-6 py-3 text-lg'

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          variantClass,
          sizeClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
