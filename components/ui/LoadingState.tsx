import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  rows?: number;
  className?: string;
}

/**
 * Skeleton rows — bukan spinner kosong/layar blank (kaidah `loading-states`).
 * `prefers-reduced-motion` dihormati lewat class Tailwind `motion-reduce:animate-none`.
 */
export function LoadingState({ rows = 4, className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-14 w-full animate-pulse rounded-lg bg-[var(--color-muted)] motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}
