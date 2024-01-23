import { v4 as uuid } from "uuid";

import {  db} from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";

export const generatePasswordResetToken =async (email:string) => {
    const token = uuid()
    const expires = new Date(new Date().getTime() + 3600*1000)

    const existToken = await getPasswordResetTokenByEmail(email)
    if(existToken) {
        await db.passwordResetToken.delete({
            where:{id: existToken.id}
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data:{
            email,
            token,
            expires
        }
    })

    return passwordResetToken
}

export const generateVerficationToken = async (email: string) => {
    const token = uuid();
    const expires  = new Date(new Date().getTime() + 3600*1000)

    const existToken = await getVerificationTokenByEmail(email)

    if(existToken){
        await db.verificatonToken.delete({
            where:{
                id: existToken.id
            }
        })
    }

    const newToken = await db.verificatonToken.create({
        data:{
            email,
            token,
            expires
        }
    })

    return newToken
}