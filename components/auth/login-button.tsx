"use client"
import { useRouter } from "next/navigation";

interface LogininButtongProps{
    children: React.ReactNode,
    mode?: "modal" | "redirect",
    asChild?:boolean
}

export const LoginButton = (
    {children,mode = "redirect",asChild}:LogininButtongProps
    )=>{
        const router = useRouter()

        const onClick = ()=>{
            router.push("/auth/login")
            console.log("login button clicked");
            
        }

        if(mode == "modal") return(
            <span>
                TODO:
            </span>
        )
    return (
        <span onClick={onClick} className="curson-pointer">
            {children}
        </span>
    )
}