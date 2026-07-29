import { type SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Native <select> yang di-styling — sengaja BUKAN Radix Select. Native select
 * sudah punya aksesibilitas & dukungan keyboard/mobile penuh secara gratis;
 * primitif custom baru dipertimbangkan kalau ada kebutuhan nyata di masa depan
 * (mis. multi-select, search-as-you-type) — YAGNI untuk sekarang.
 */
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 pr-9 text-sm text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]"
        />
      </div>
    );
  },
);
Select.displayName = "Select";
