import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { DEFAULT_LOGIN_REDIRECT,apiAuthPrefix,authRoutes,publicRoutes } from "@/routes";

const {auth} = NextAuth(authConfig)

export default auth((req)=>{
    const isLoggedIn = !!req.auth;
    const {nextUrl} = req;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    // below check order matters
    if(isApiAuthRoute) return null;

    if(isAuthRoute) {
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return null
    }

    if(!isLoggedIn && !isPublicRoute){
        return Response.redirect(new URL("/auth/login",nextUrl))
    }

    console.log("ROUTE:   ",req.nextUrl.pathname);
    console.log("IS LoggedIn: ", isLoggedIn);
    return null;
    
})

// invoke Middleware on paths in matcher array
export const config = {
    // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
    // matcher:["/auth/login"], // list for invoke middleware
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}