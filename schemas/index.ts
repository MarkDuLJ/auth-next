import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message:"Require email"
    }),
    password: z.string().min(1,{message:"Require password"})
})
export const RegisterSchema = z.object({
    email: z.string().email({
        message:"Require email"
    }),
    password: z.string().min(6,{message:"Require 6 chars at least"}),
    name: z.string().min(1,{
        message:"Require Name"
    })
})