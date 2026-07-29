import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import type { GlobalRole } from "@/lib/generated/prisma/client";

export interface TopbarProps {
  name: string;
  email: string;
  image?: string | null;
  role: GlobalRole | null;
}

export function Topbar({ name, email, image, role }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <MobileNav role={role} />
        <span className="font-heading text-lg font-bold text-[var(--color-primary)] sm:hidden">
          PMS
        </span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Avatar src={image} name={name} size={32} />
        <div className="hidden text-sm sm:block">
          <p className="font-medium text-[var(--color-foreground)]">{name}</p>
          <p className="text-[var(--color-muted-foreground)]">{email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button type="submit" variant="ghost" size="sm" aria-label="Logout">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
