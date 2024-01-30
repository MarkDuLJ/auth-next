"use client"
import { logout } from "@/actions/logout";

import { useCurrentUser } from "@/hooks/use-current-user";

const SettingPage =  () => {

    const user = useCurrentUser()
    return (
        <>
        <h1>setting {JSON.stringify(user)}</h1>
        <button type="submit" onClick={()=>logout()}>
            Sign Out
        </button>
        </>
    )
}

export default SettingPage