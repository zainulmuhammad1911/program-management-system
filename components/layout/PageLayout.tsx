import type { ReactNode } from "react";
import type { GlobalRole } from "@/lib/generated/prisma/client";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export interface PageLayoutProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: GlobalRole | null;
  };
  children: ReactNode;
}

/**
 * Fondasi layout aplikasi — dipakai oleh SELURUH halaman terautentikasi PMS,
 * bukan khusus halaman Admin. Struktur: Sidebar + Topbar (chrome) mengapit
 * Content (children). Setiap halaman merender PageHeader/Toolbar-nya sendiri
 * di dalam `children` sesuai kebutuhan masing-masing.
 */
export function PageLayout({ user, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col">
        <Topbar name={user.name} email={user.email} image={user.image} role={user.role} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
