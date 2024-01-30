"use client"
import { FaUser , FaUserLock} from "react-icons/fa";

import { DropdownMenu, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Avatar,AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";

export const UserButton = () => {
    const user = useCurrentUser()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                <LogoutButton>
                        logout<FaUserLock />
                </LogoutButton>
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}