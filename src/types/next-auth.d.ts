//This file is used to extend the Session and JWT type with the user id (MongoDB id)

import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's MongoDB _id as a string */
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    /** The user's MongoDB _id as a string */
    id: string;
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's MongoDB _id */
    id: string;
  }
}
