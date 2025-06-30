import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma/client"
import bcrypt from "bcrypt"

// Función para autenticar usuario con email y password
const getUserFromDb = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password ?? "")
  return isValid ? user : null
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma as any), // Soluciona error de tipos
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan credenciales")
        }

        const user = await getUserFromDb(credentials.email, credentials.password)
        if (!user) {
          throw new Error("Usuario no encontrado o contraseña incorrecta")
        }

        return user
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      checks: ["none"],
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  callbacks: {
    async signIn({ user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (dbUser?.isActive === false) {
        console.log("Cuenta inactiva")
        return false
      }

      return true
    },

    async jwt({ token }) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email ?? undefined },
        })

        if (dbUser) {
          token.roles = dbUser.roles ?? ["no-roles"]
          token.id = dbUser.id
          token.isActive = dbUser.isActive ?? true // Se usa internamente, no rompe tipos
        }
      } catch (error) {
        console.error("Error en jwt callback:", error)
      }

      return token
    },

    async session({ session, token }) {
      if (session?.user) {
        ;(session.user as any).roles = token.roles
        ;(session.user as any).id = token.id
        ;(session.user as any).isActive = token.isActive
      }

      return session
    },

    async redirect({ url }) {
      return url
    },
  },
})
