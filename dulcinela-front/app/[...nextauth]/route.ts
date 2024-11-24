import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import type { User, Session } from "next-auth"

const handler = NextAuth({
 providers: [
   CredentialsProvider({
     name: 'Credentials',
     credentials: {
       email: { label: "Email", type: "email" },
       password: { label: "Password", type: "password" }
     },
     async authorize(credentials) {
       try {
         const res = await fetch('http://localhost:3000/api/Users/authenticateUser', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             email: credentials?.email,
             password: credentials?.password,
           }),
           credentials: 'include', // Important for cookies
         })
          const data = await res.json()
          if (res.ok && data.access_token) {
           // Return both user data and token
           return {
             ...data.user,
             accessToken: data.access_token
           }
         }
         return null
       } catch (error) {
         console.error('Authentication error:', error)
         return null
       }
     }
   })
 ],
 callbacks: {
   async jwt({ token, user }) {
     if (user) {
       token.accessToken = user.accessToken
       token.user = user
     }
     return token
   },
   async session({ session, token }) {
     session.accessToken = token.accessToken
     session.user = token.user
     return session
   }
 },
 pages: {
   signIn: '/login',
 },
 session: {
   strategy: "jwt",
 },
})
export { handler as GET, handler as POST }