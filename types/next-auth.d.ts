// next-auth.d.ts (Este es el archivo para las declaraciones de tipo)

import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
  interface User extends NextAuthUser {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
  }
}

// Opcional pero recomendado
// declare module "next-auth/adapters" {
//   interface AdapterUser extends NextAuthUser {
//     role?: string;
//   }
// }