import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kelola Global Role"
        description="Atur siapa saja yang memiliki akses Administrator penuh."
      />
      <LoadingState rows={4} />
    </div>
  );
}
