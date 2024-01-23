"use server"

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken,  } from "@/lib/tokens";
import { sendPasswordResetEmail,  } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)
    if(!validatedFields.success) return {error:"Invalid fields"}

    const { email} = validatedFields.data

    const exsitUser = await getUserByEmail(email)

    if(!exsitUser ){
        return {error: "Invalid Email"}
    }

    const passwordResetToken = await generatePasswordResetToken(email)

    await sendPasswordResetEmail(passwordResetToken.email,passwordResetToken.token)


    return {success:"Reset email sent!"}
}