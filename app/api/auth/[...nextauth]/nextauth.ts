// app/api/auth/[...nextauth]/nextauth.ts (Este es el archivo correcto para este código)

import type { NextAuthOptions } from "next-auth";

import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "user"; // por defecto "user"
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }

      return session;
    },
  },
};
