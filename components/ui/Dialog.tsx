"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixDialog.Content>) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-lg focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <RadixDialog.Close asChild>
          <button
            aria-label="Tutup"
            className="absolute right-4 top-4 rounded-md p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export const DialogTitle = RadixDialog.Title;
export const DialogDescription = RadixDialog.Description;

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "destructive";
  onConfirm: () => void;
  isPending?: boolean;
}

/**
 * Dialog konfirmasi generik untuk aksi sensitif (mis. perubahan role,
 * penghapusan). Selalu punya jalur batal (tombol Cancel + tombol X + Esc
 * bawaan Radix) — sesuai kaidah aksesibilitas `escape-routes`.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "primary",
  onConfirm,
  isPending = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        <DialogDescription className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          {description}
        </DialogDescription>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Memproses..." : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
