import { Badge } from "./Badge";

export type StatusTone = "primary" | "success" | "neutral";

export interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
}

/**
 * Badge status generik — SELALU menampilkan teks (`label`), tidak pernah
 * hanya warna, sesuai kaidah aksesibilitas "color-not-only".
 */
export function StatusBadge({ label, tone }: StatusBadgeProps) {
  const variant = tone === "primary" ? "primary" : tone === "success" ? "success" : "neutral";
  return <Badge variant={variant}>{label}</Badge>;
}
