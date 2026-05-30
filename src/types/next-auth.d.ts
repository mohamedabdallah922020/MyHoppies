import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    rememberMe?: boolean;
  }

  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    rememberMe?: boolean;
  }
}
