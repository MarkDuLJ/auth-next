"use server"
import * as z from "zod";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import { db } from "@/lib/db";

export const newPassword =async (
    values:z.infer<typeof NewPasswordSchema>, 
    token: string | null) => {
    if(!token) return {error:"Not token"}

    const validatedFields = NewPasswordSchema.safeParse(values)

    if(!validatedFields.success) return {error:"invalid fields"}
    const {password} = validatedFields.data

    const existingToken = await getPasswordResetTokenByToken(token)

    if(!existingToken) return {error:"token invalid!"}

    const isExpired = new Date(existingToken.expires) < new Date()

    if(isExpired) return {error:"token is expired!"}

    const existingUser =  await getUserByEmail(existingToken.email)

    if(!existingUser) return {error:`email: ${existingToken.email} does not exist!`};

    await db.user.update({
        where:{id:existingUser.id},
        data:{
            password
        }
    })
    
    await db.passwordResetToken.delete({
        where:{id: existingToken.id}
    })

    return {success:"password updated!"}
}