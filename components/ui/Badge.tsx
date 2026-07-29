import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-muted)] text-[var(--color-foreground)]",
        primary:
          "bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-1 ring-inset ring-[var(--color-primary)]/20",
        success:
          "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
        neutral:
          "bg-[var(--color-surface)] text-[var(--color-muted-foreground)] ring-1 ring-inset ring-[var(--color-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
