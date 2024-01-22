import NextAuth,{type DefaultSession} from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";


export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}



export const {
  handlers: { GET, POST },
  auth,
  signIn,signOut
} = NextAuth({
  pages:{
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events:{
    async linkAccount({user}){
      await db.user.update({
        where:{id: user.id},
        data:{emailVerified: new Date()}
      })
    }
  },
  callbacks:{
    async signIn({user,account}){
      // oAuth doesn't need email verification
      if(account?.provider !== "credentials") return true

      const exsitUser = await getUserById(user.id)

      // if just registered but no email confirmation
      if(!exsitUser?.emailVerified) return false

      return true
    },
    async jwt({token}){  
      if(!token.sub) return token;
      const currentUser = await getUserById(token.sub)  
      if(!currentUser) return token;
      token.role = currentUser.role;  
      return token
    },
    async session({token, session}){
      console.log(token);
      
      if(token.sub && session.user){
        session.user.id = token.sub;
      }
      
      if(token.role && session.user){
        session.user.role = token.role as UserRole;
      }
      return session
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig
})