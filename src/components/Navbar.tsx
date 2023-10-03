import { UserButton } from "@clerk/nextjs";
import MobileSideBar from "./MobileSideBar";

const Navbar = () => {
    return (
        <nav className="flex items-center p-4">
            <MobileSideBar />
            <div className="w-full flex justify-end">
                <UserButton afterSignOutUrl="/" />
            </div>
        </nav>
    );
}

export default Navbar;