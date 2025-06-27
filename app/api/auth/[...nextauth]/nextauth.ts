// app/api/auth/[...nextauth]/nextauth.ts

import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

// AÑADE ESTO TEMPORALMENTE PARA DEPURAR EL SECRETO
// ¡NO LO DEJES EN PRODUCCIÓN!
console.log('DEBUG: NEXTAUTH_SECRET from process.env:', process.env.NEXTAUTH_SECRET ? 'Loaded (length: ' + process.env.NEXTAUTH_SECRET.length + ')' : 'NOT LOADED');
console.log('DEBUG: NEXTAUTH_URL from process.env:', process.env.NEXTAUTH_URL || 'Not Set');


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
  secret: process.env.NEXTAUTH_SECRET, // Asegúrate de que esto esté así
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "user";
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