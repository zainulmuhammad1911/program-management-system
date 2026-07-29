"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Kelola Global Role" />
      <ErrorState
        description="Gagal memuat daftar user. Periksa koneksi Anda dan coba lagi."
        onRetry={reset}
      />
    </div>
  );
}
