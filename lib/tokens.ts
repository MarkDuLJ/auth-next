import { v4 as uuid } from "uuid";

import {  db} from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";

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