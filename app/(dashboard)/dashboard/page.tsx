import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan Program akan tampil di sini pada Fase 5."
      />
      <p className="text-sm text-[var(--color-muted-foreground)]">
        Login sebagai {session?.user.email} — Role global:{" "}
        {session?.user.role ?? "(tidak ada)"}
      </p>
    </div>
  );
}
