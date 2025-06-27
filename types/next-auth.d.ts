// next-auth.d.ts (o src/types/next-auth.d.ts, donde lo tengas)

import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // <--- ¡AÑADIR ESTO! El ID del usuario
      role?: string;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the user object in the adapter's `createUser` method.
   */
  interface User extends NextAuthUser {
    id: string; // <--- ¡AÑADIR ESTO! Para el tipo User de NextAuth.js
    role?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT extends DefaultJWT {
    id: string; // <--- ¡AÑADIR ESTO! Si quieres el ID en el token JWT
    role?: string;
  }
}

// Opcional pero recomendado si usas un adaptador y quieres tipar el usuario del adaptador
// declare module "next-auth/adapters" {
//   interface AdapterUser extends NextAuthUser {
//     id: string; // <--- ¡AÑADIR ESTO! Si usas AdapterUser
//     role?: string;
//   }
// }