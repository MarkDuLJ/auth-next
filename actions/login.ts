"use server"

import * as z from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "@/schemas";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getUserByEmail } from "@/data/user";
import { generateVerficationToken, generateTwoFactorToken } from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)
    if(!validatedFields.success) return {error:"Invalid fields"}

    const { email, password,code} = validatedFields.data

    const exsitUser = await getUserByEmail(email)

    if(!exsitUser || !exsitUser.email || !exsitUser.password){
        return {error: "Invalid Crendentials"}
    }

    if(!exsitUser.emailVerified){
        const verificationToken = await generateVerficationToken(exsitUser.email)
        await sendVerificationEmail(verificationToken.email,verificationToken.token)
        return {success:"Pls check confirmation mail sent to you"}
    }

    if(exsitUser.isTwoFactor && exsitUser.email){
        if(code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(exsitUser.email)
            if(!twoFactorToken || twoFactorToken.token !== code){
                return {error:`Invalid code: ${code}`}
            }

            const isExpired = new Date(twoFactorToken.expires) < new Date()
            if(isExpired) return {error:"code expired."}

            // delete token and create two factor confirmation

            await db.twoFactorToken.delete({
                where:{id: twoFactorToken.id}
            })

            const existTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(exsitUser.id)

            if(existTwoFactorConfirmation){
                await db.twoFactorConfirmation.delete({
                    where:{id: existTwoFactorConfirmation.id}
                })
            }

            await db.twoFactorConfirmation.create({
                data:{
                    userId: exsitUser.id
                }
            })
        }
        else{

            const twoFactorToken =  await generateTwoFactorToken(exsitUser.email)
            
            await sendTwoFactorTokenEmail(twoFactorToken.email,twoFactorToken.token)
            
            return {TwoFactor: true}
        }
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