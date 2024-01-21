import { auth, signOut } from "@/auth";

const SettingPage = async () => {

    const session = await auth()
    return (
        <>
        <h1>setting {session?.user.role}</h1>
        {JSON.stringify(session)}
        <form action={
            async () => {
                "use server"
                await signOut()
            }
        }>
            <button type="submit">Sign Out</button>
        </form>
        </>
    )
}

export default SettingPage