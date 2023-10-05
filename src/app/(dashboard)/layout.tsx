import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { getApiLimit } from "@/lib/api-limit";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const apiLimitCount = await getApiLimit();

    return (
        <div className="h-full relative">
            <div className="hidden md:flex md:w-72 h-full md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <SideBar apiLimitCount={apiLimitCount} />
            </div>
            <main className="md:pl-72">
                <Navbar />
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;