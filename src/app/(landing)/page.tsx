import { Button } from "@/components/ui/button";
import Link from "next/link";


const LandingPage = () => {
    return (
        <div>
            <h1>Landing Page (Unprotected)</h1>
            <Link href="/sign-in">
                <Button type="button" variant="default">
                    Login
                </Button>
            </Link>
            <Link href="/sign-up">
                <Button type="button" variant="destructive">
                    Register
                </Button>
            </Link>
        </div>
    );
}

export default LandingPage;