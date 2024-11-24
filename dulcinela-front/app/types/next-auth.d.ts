import "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    accessToken?: string;
    id?: string;
    firstname?: string;
    lastname?: string;
  }

  interface Session {
    accessToken?: string;
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: User;
  }
} 