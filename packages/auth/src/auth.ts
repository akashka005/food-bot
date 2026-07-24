import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@smartfood/database";
import { verifyPassword } from "./password";
import { loginSchema } from "@smartfood/shared";
import type { UserRole } from "@smartfood/shared";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
  interface User {
    role: UserRole;
  }
}

import type { NextAuthConfig } from "next-auth";

const config = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { email, password, role } = loginSchema.parse(credentials);

          if (role === "STUDENT") {
            const user = await prisma.student.findUnique({ where: { email } });
            if (!user || !user.passwordHash) return null;

            const isValid = await verifyPassword(password, user.passwordHash);
            if (!isValid) return null;

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: "STUDENT",
            };
          }

          if (role === "VENDOR") {
            const user = await prisma.vendor.findUnique({ where: { email } });
            if (!user || !user.passwordHash) return null;

            const isValid = await verifyPassword(password, user.passwordHash);
            if (!isValid) return null;

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: "VENDOR",
            };
          }

          if (role === "ADMIN" || role === "SUPER_ADMIN") {
            const user = await prisma.admin.findUnique({ where: { email } });
            if (!user || !user.passwordHash) return null;

            const isValid = await verifyPassword(password, user.passwordHash);
            if (!isValid) return null;

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.isSuperAdmin ? "SUPER_ADMIN" : "ADMIN",
            };
          }

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as any;
      if (user) {
        t.id = user.id;
        t.role = user.role;
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as any;
      if (session.user) {
        session.user.id = t.id as string;
        session.user.role = t.role as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
