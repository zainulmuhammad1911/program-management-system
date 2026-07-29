import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
      <div className="text-[var(--color-muted-foreground)]">
        {icon ?? <Inbox className="h-10 w-10" aria-hidden="true" />}
      </div>
      <p className="font-heading text-base font-semibold text-[var(--color-foreground)]">
        {title}
      </p>
      {description && (
        <p className="max-w-sm text-sm text-[var(--color-muted-foreground)]">{description}</p>
      )}
      {action}
    </div>
  );
}
