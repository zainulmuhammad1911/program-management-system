import { LayoutDashboard, ShieldCheck } from "lucide-react";
import type { GlobalRole } from "@/lib/generated/prisma/client";
import { hasRole } from "@/features/auth/services/authorization.service";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/admin/users", label: "Kelola Role", icon: ShieldCheck, adminOnly: true },
] as const;

export function visibleNavItems(role: GlobalRole | null) {
  return NAV_ITEMS.filter((item) => !item.adminOnly || hasRole(role, "ADMIN"));
}
