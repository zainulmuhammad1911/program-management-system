import { DefaultSession } from "next-auth";

// Module augmentation kosong untuk T0.3.
// Sprint 1 (T1.x) akan menambah field di sini (mis. userId, role)
// setelah model User & role tersedia — tanpa mengubah pondasi ini.

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- kerangka untuk Sprint 1
  interface JWT {
    // Klaim tambahan ditambahkan di Sprint 1.
  }
}
