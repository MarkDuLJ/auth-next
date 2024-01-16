import { auth } from "@/auth";

const SettingPage = async () => {

    const session = await auth()
    return (
        <>
        <h1>seeting</h1>
        {JSON.stringify(session)}
        </>
    )
}

export default SettingPage