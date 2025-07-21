import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    currentPhase?: string
  }

  interface Session {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      role?: string
      currentPhase?: string
    }
  }

  interface JWT {
    role?: string
    currentPhase?: string
  }
}