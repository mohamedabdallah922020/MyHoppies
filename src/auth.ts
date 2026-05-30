import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

const REMEMBER_SECONDS = 30 * 24 * 60 * 60;
const SESSION_SECONDS = 24 * 60 * 60;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: REMEMBER_SECONDS,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "text" },
      },
      authorize: async (credentials) => {
        const emailRaw = credentials?.email;
        const passwordRaw = credentials?.password;
        if (!emailRaw || !passwordRaw) {
          return null;
        }

        const email = String(emailRaw).toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return null;
        }

        const valid = await compare(String(passwordRaw), user.passwordHash);
        if (!valid) {
          return null;
        }

        const rememberMe =
          credentials.rememberMe === "true" || credentials.rememberMe === true;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          rememberMe,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        if (user.email) {
          token.email = user.email;
        }
        token.rememberMe = user.rememberMe === true;
        const maxAgeSeconds =
          user.rememberMe === true ? REMEMBER_SECONDS : SESSION_SECONDS;
        token.exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        const email =
          typeof token.email === "string" ? token.email : undefined;
        if (email) {
          session.user.email = email;
        }
      }
      return session;
    },
  },
});
