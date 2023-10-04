import Image from "next/image";

interface EmptyProps {
    label: string
}

const Empty: React.FC<EmptyProps> = ({ label }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="relative h-72 w-72">
                <Image src='/empty.png' fill alt="empty" />
            </div>
            <p className="text-muted-foreground text-center">{label}</p>
        </div>
    );
}

export default Empty;