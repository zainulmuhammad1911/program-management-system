"use client";

import { useState } from "react";
import Link from "next/link";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import type { GlobalRole } from "@/lib/generated/prisma/client";
import { visibleNavItems } from "./nav-items";

export interface MobileNavProps {
  role: GlobalRole | null;
}

/**
 * Navigasi mobile — Sidebar desktop disembunyikan penuh di layar kecil
 * (`hidden sm:block`), jadi ini satu-satunya jalan membuka "Kelola Role"
 * dari halaman lain saat di mobile. Dibangun di atas Radix Dialog yang sama
 * dengan ConfirmDialog agar perilaku fokus/Esc/aria konsisten.
 */
export function MobileNav({ role }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const items = visibleNavItems(role);

  return (
    <RadixDialog.Root open={open} onOpenChange={setOpen}>
      <RadixDialog.Trigger asChild>
        <button
          type="button"
          aria-label="Buka menu navigasi"
          className="rounded-md p-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] sm:hidden"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <RadixDialog.Content className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[var(--color-background)] p-4 shadow-lg focus:outline-none">
          <div className="mb-4 flex items-center justify-between">
            <RadixDialog.Title asChild>
              <span className="font-heading text-lg font-bold text-[var(--color-primary)]">
                PMS
              </span>
            </RadixDialog.Title>
            <RadixDialog.Close asChild>
              <button
                aria-label="Tutup menu"
                className="rounded-md p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </RadixDialog.Close>
          </div>
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                >
                  <Icon className="h-5 w-5 text-[var(--color-muted-foreground)]" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
