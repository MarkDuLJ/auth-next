import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message:"Require email"
    }),
    password: z.string().min(1,{message:"Require password"})
})

export const ResetSchema = z.object({
    email: z.string().email({
        message:"Require email"
    }),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6,{
        message:"At least 6 characters"
    }),
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message:"Require email"
    }),
    password: z.string().min(6,{message:"At least 6 characters"}),
    name: z.string().min(1,{
        message:"Require Name"
    })
})