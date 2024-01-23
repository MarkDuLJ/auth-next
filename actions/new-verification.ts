"use server"

import { db } from "@/lib/db";
import { getUserByEmail} from "@/data/user";
import { getVerificationTokenByToken} from "@/data/verification-token";

export const newVerification =async (token:string) => {
    const existToken =  await getVerificationTokenByToken(token)

    if(!existToken) return {error:`Token: ${token} not exist!`}

    const isExpired = new Date(existToken.expires) < new Date()

    if(isExpired) return {error: "Token is expired!"}

    const exsitUser = await getUserByEmail(existToken.email)
    if(!exsitUser) return {error:`Email: ${existToken.email} does not exist!`}

    await db.user.update({
        where:{ id: exsitUser.id},
        data:{
            emailVerified: new Date(),
            email: existToken.email
        }
    })

    await db.verificatonToken.delete({
        where:{id:existToken.id}
    })

    return {success:"Email verify succeded!"}
}