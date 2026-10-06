import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.72rem] font-bold uppercase tracking-[.08em]",
  {
    variants: {
      variant: {
        default: "border-[var(--slate-line)] bg-[var(--slate-50)] text-[var(--slate-700)]",
        available: "border-[var(--green-line)] bg-[var(--green-50)] text-[var(--green-700)]",
        possible: "border-[#c9dce9] bg-[var(--blue-100)] text-[var(--blue-700)]",
        review: "border-[var(--amber-line)] bg-[var(--amber-50)] text-[var(--amber-700)]",
        proposed: "border-[#ded8ea] bg-[#f4f1f8] text-[#66517d]",
        premium: "border-[var(--gold-line)] bg-[var(--gold-50)] text-[var(--gold-700)]"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
