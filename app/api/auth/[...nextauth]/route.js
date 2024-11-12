import NextAuth from 'next-auth'
import CredentialsProviders from 'next-auth/providers/credentials'
import connectDB from "@/lib/mongodb"
import Admin from '@/models/admin'
import bcrypt from 'bcryptjs'
import { signIn } from 'next-auth/react'

export const authOptions = {
  providers: [
    CredentialsProviders({
      name: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { username, password } = credentials;
        console.log(username, password)

        if (!username || !password) {
          throw new Error("Username and password are required");
        }

        try {
          console.log("Hi auth")
          await connectDB()
          const admin = await Admin.findOne({ username })
          if (!admin) {
            throw new Error("No admin found with this username")
          }
          const passwordMatch = await bcrypt.compare(password, admin.password)
          if (!passwordMatch) {
            console.log("Invalid password")
            throw new Error("Invalid password")
          }
          console.log(admin)
          return admin.username
        } catch (err) {
          console.log("Error during authorization", err)
          throw new Error("Authorization failed")
        }
      }
    }),

  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user = token.user; // Ensure user data is included in the session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Store user data in the token
      }
      return token;
    }
  },
  pages: {
    signIn: "/admin"
  }
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }