import { v4 as uuid } from "uuid";
import crypto from "crypto"

import {  db} from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateTwoFactorToken =async (email:string) => {

    const token  = crypto.randomInt(100_000,1_000_000).toString()
    const expires = new Date(new Date().getTime() + 3600*1000)
    
    const existToken = await getTwoFactorTokenByEmail(email)
    if(existToken){
        await db.twoFactorToken.delete({
            where:{id: existToken.id}
        })
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data:{
            email,
            expires,
            token
        }
    })

    return twoFactorToken
}

export const generatePasswordResetToken =async (email:string) => {
    const token = uuid()
    const expires = new Date(new Date().getTime() + 600*1000)

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