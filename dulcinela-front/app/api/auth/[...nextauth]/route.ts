import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
            credentials: 'include',
          })

          const data = await res.json()

          if (res.ok && data.access_token) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
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

  pages: {
    signIn: '/login',
  },
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
  }
})

export { handler as GET, handler as POST } 
// comment