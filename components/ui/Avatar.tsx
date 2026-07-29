import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ src, name, size = 32, className }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-muted)] font-medium text-[var(--color-muted-foreground)]",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initialsOf(name)}
    </span>
  );
}
