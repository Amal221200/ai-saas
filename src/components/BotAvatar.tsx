"use client";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BotAvatar = () => {
    const { user } = useUser()
    return (
        <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
                {user?.firstName?.at(0)}
                {user?.lastName?.at(0)}
            </AvatarFallback>
        </Avatar>
    );
}

export default BotAvatar;