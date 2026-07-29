import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/features/auth/services/authorization.service";
import { RoleActionCell } from "@/features/auth/components/RoleActionCell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import type { GlobalRole } from "@/lib/generated/prisma/client";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: GlobalRole | null;
  isActive: boolean;
  lastLoginAt: Date | null;
}

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(date);
}

const columns: DataTableColumn<UserRow>[] = [
  {
    key: "email",
    header: "Email",
    render: (u) => <span className="font-medium">{u.email}</span>,
  },
  {
    key: "name",
    header: "Nama",
    render: (u) => u.name ?? "—",
  },
  {
    key: "role",
    header: "Role",
    render: (u) =>
      u.role === "ADMIN" ? (
        <StatusBadge label="ADMIN" tone="primary" />
      ) : (
        <StatusBadge label="—" tone="neutral" />
      ),
  },
  {
    key: "status",
    header: "Status",
    render: (u) => (
      <StatusBadge label={u.isActive ? "Aktif" : "Nonaktif"} tone={u.isActive ? "success" : "neutral"} />
    ),
  },
  {
    key: "lastLoginAt",
    header: "Login Terakhir",
    render: (u) => formatDate(u.lastLoginAt),
  },
  {
    key: "actions",
    header: "Aksi",
    render: (u) => <RoleActionCell userId={u.id} email={u.email} role={u.role} />,
  },
];

export default async function AdminUsersPage() {
  const session = await auth();

  if (!hasRole(session?.user.role ?? null, "ADMIN")) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
    },
    orderBy: { email: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kelola Global Role"
        description="Atur siapa saja yang memiliki akses Administrator penuh."
      />

      {users.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10" aria-hidden="true" />}
          title="Belum ada user yang terdaftar"
          description="User akan muncul otomatis di sini setelah mereka login pertama kali lewat Google."
        />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          getRowKey={(u) => u.id}
          renderMobileCard={(u) => (
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-medium">{u.email}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">{u.name ?? "—"}</p>
              </div>
              <div className="flex items-center gap-2">
                {u.role === "ADMIN" ? (
                  <StatusBadge label="ADMIN" tone="primary" />
                ) : (
                  <StatusBadge label="—" tone="neutral" />
                )}
                <StatusBadge
                  label={u.isActive ? "Aktif" : "Nonaktif"}
                  tone={u.isActive ? "success" : "neutral"}
                />
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Login terakhir: {formatDate(u.lastLoginAt)}
              </p>
              <div className="pt-1">
                <RoleActionCell userId={u.id} email={u.email} role={u.role} />
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
