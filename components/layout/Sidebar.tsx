import Link from "next/link";
import type { GlobalRole } from "@/lib/generated/prisma/client";
import { visibleNavItems } from "./nav-items";

export interface SidebarProps {
  role: GlobalRole | null;
}

export function Sidebar({ role }: SidebarProps) {
  const items = visibleNavItems(role);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] sm:block">
      <div className="flex h-16 items-center px-6">
        <span className="font-heading text-lg font-bold text-[var(--color-primary)]">PMS</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              <Icon className="h-5 w-5 text-[var(--color-muted-foreground)]" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
