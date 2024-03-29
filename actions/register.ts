"use server"

import * as z from "zod";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { RegisterSchema } from "@/schemas";
import { generateVerficationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)
    if(!validatedFields.success) return {error:"Invalid fields"}

    const {email, password, name} = validatedFields.data;
    const hashedPassword = password;
    // bcrypt has an issue with webpack, remove from code
    // const hashedPassword = await bcrypt.hash(password,10)

    const existingUser = await getUserByEmail(email)

    if(existingUser) return {error:`Email: ${email} is already taken!`}

    await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }
    })

    // send verification token email 
    const verificationToken = await generateVerficationToken(email)

    await sendVerificationEmail(verificationToken.email, verificationToken.token)
        
    return {success:`User: ${name}, confirmation email sent!`}
}