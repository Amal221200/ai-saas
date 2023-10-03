"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import SideBar from "./SideBar";
import { useEffect, useState } from "react";

const MobileSideBar = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    
    return (
        <Sheet>
            <SheetTrigger>
                <Button variant={'ghost'} size={'icon'} className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side={'left'} className="p-0 m-0 h-full" >
                <SideBar />
            </SheetContent>
        </Sheet>
    );
}

export default MobileSideBar;