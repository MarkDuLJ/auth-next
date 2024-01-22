"use server"

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerficationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)
    if(!validatedFields.success) return {error:"Invalid fields"}

    const { email, password} = validatedFields.data

    const exsitUser = await getUserByEmail(email)

    if(!exsitUser || !exsitUser.email || !exsitUser.password){
        return {error: "Invalid Crendentials"}
    }

    if(!exsitUser.emailVerified){
        const verificationToken = await generateVerficationToken(exsitUser.email)
        await sendVerificationEmail(verificationToken.email,verificationToken.token)
        return {success:"Pls check confirmation mail sent to you"}
    }


    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })        
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error:"credential is invalid"}
            
                default:
                    return {error:"Unkown error."}
            }
        }
//  next.js required
        throw error
    }


    return {success:"everything is right"}
}