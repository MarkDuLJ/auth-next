import { ExitFullScreenIcon } from "@radix-ui/react-icons";

import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
    return (
        <CardWrapper headerLabel="Some unknown error" backButtonHref="/auth/login" backButtonLabel="Back to Login">
            <div  className="w-full flex justify-center">
                <ExitFullScreenIcon className="text-destructive"/>
            </div>
        </CardWrapper>
    )
}