import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { connectDB } from "@/lib/mongoDbAdvanced";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  // Stateless sessions: no DB adapter needed
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.trim();
          const password = credentials?.password ?? "";
          if (!email || !password) return null;

          await connectDB();

          // Find user by email
          const user: any = await User.findOne({ email });
          if (!user || !user.password) return null;

          //Check if credential password matches the user's stored password
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          // Return minimal user for JWT
          return {
            id: String(user._id),
            name: user.name,
            email: user.email,
          };
        } catch (err) {
          console.error("Credentials authorize error", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, persist their id in the token
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose id in session.user so you can access it on the client
      if (token?.id) {
        if (session.user) session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
