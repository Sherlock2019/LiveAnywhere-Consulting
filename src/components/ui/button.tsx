import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border text-sm font-semibold transition-[color,background-color,border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default: "border-[var(--blue)] bg-[var(--blue)] px-5 text-white shadow-sm hover:border-[var(--blue-600)] hover:bg-[var(--blue-600)] hover:shadow-md",
        secondary: "border-[var(--line-strong)] bg-white px-5 text-[var(--navy)] hover:border-[var(--blue)] hover:bg-[var(--blue-50)]",
        gold: "border-[var(--gold)] bg-[var(--gold)] px-5 text-[var(--navy-900)] hover:border-[#c8882f] hover:bg-[#c8882f]",
        ghost: "border-transparent bg-transparent px-3 text-[var(--blue-600)] hover:bg-[var(--blue-100)] hover:text-[var(--navy)]",
        dark: "border-[var(--navy)] bg-[var(--navy)] px-5 text-white hover:bg-[var(--navy-900)]"
      },
      size: {
        default: "h-12",
        sm: "h-10 min-h-10 px-4",
        lg: "h-14 px-7 text-base",
        icon: "size-11 min-h-11 px-0"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
