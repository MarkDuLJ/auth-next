"use client"
import {useCallback, useEffect, useState} from "react"
import { BounceLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "./card-wrapper"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { newVerification } from "@/actions/new-verification";

export const NewVerificationForm = ()=>{

    const [error, SetError] = useState<string | undefined>()
    const [success, SetSuccess] = useState<string | undefined>()

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const onSubmit = useCallback(()=>{
        if(!token) {
            SetError(`Missing token: ${token}`)
            return
        }
        newVerification(token).then((data)=>{
            SetSuccess(data.success)
            SetError(data.error)
        }).catch(()=>{
            SetError("Unkown error")
        })
    }, [token])

    useEffect(()=>{
        onSubmit()
    }, [onSubmit])
    return(
        <CardWrapper 
            headerLabel="Confrim your verification"
            backButtonHref="/auth/login"
            backButtonLabel="Back to Login"
            >
                <div className="flex items-center w-full justify-center">
                    {!success && !error && <BounceLoader />}
                    <FormSuccess message={success}/>
                    <FormError message={error}/>
                </div>
        </CardWrapper>
    )
}