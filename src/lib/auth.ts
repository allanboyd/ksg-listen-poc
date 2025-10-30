import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db/client";
import { users, roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const email = String(creds.email).toLowerCase().trim();
        const rows = await db.select().from(users).where(eq(users.email, email));
        if (rows.length === 0) return null;
        const user = rows[0] as any;
        const ok = await bcrypt.compare(String(creds.password), user.passwordHash);
        if (!ok) return null;
        const roleRows = await db.select().from(roles).where(eq(roles.id, user.roleId));
        const roleName = roleRows[0]?.name || "participants";
        return { id: String(user.id), email: user.email, name: user.name || user.email, role: roleName } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }: any) {
      (session as any).role = (token as any).role || "participants";
      return session;
    },
  },
};


