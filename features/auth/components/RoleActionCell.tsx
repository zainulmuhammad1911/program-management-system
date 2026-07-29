"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { updateGlobalRole } from "@/features/auth/actions/update-global-role";
import type { GlobalRole } from "@/lib/generated/prisma/client";

export interface RoleActionCellProps {
  userId: string;
  email: string;
  role: GlobalRole | null;
}

export function RoleActionCell({ userId, email, role }: RoleActionCellProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isAdmin = role === "ADMIN";

  function handleConfirm() {
    startTransition(async () => {
      const result = await updateGlobalRole(userId, isAdmin ? null : "ADMIN");
      if (result.ok) {
        toast.success(
          isAdmin ? "Role Admin berhasil dihapus." : "User berhasil dijadikan Admin.",
        );
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant={isAdmin ? "destructive" : "primary"}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {isAdmin ? "Hapus Admin" : "Jadikan Admin"}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={isAdmin ? "Hapus akses Admin?" : "Jadikan Admin?"}
        description={
          isAdmin
            ? `${email} akan kehilangan akses Administrator penuh.`
            : `${email} akan mendapat akses Administrator penuh ke seluruh Workspace.`
        }
        confirmLabel={isAdmin ? "Ya, Hapus Admin" : "Ya, Jadikan Admin"}
        variant={isAdmin ? "destructive" : "primary"}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </>
  );
}
