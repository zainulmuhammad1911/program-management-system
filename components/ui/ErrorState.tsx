import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

/**
 * `role="alert"` — kesalahan diumumkan ke screen reader saat muncul,
 * bukan hanya indikasi visual (kaidah aksesibilitas `aria-live-errors`).
 */
export function ErrorState({
  title = "Terjadi kesalahan",
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[var(--color-destructive)]/30 bg-[var(--color-destructive)]/5 px-6 py-12 text-center"
    >
      <AlertTriangle
        className="h-8 w-8 text-[var(--color-destructive)]"
        aria-hidden="true"
      />
      <p className="font-heading text-base font-semibold text-[var(--color-foreground)]">
        {title}
      </p>
      <p className="max-w-sm text-sm text-[var(--color-muted-foreground)]">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
