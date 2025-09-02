import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // ✅ tambahkan role di session
    };
  }

  interface User {
    role?: string | null; // ✅ tambahkan role di user (kalau diperlukan)
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null; // ✅ tambahkan role di JWT token
  }
}
