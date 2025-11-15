import RedirectIfAuth from "@/components/auth/RedirectIfAuth";

import Heading from "@/components/layout/Heading";
import AuthSection from "@/components/login/AuthSection";

export default function Login() {
    return (
        <RedirectIfAuth>
            <div className="border-primary relative flex h-[85%] min-h-100 w-[85%] flex-col items-center justify-evenly rounded-lg border-2 bg-white dark:bg-black">
                <div className="flex flex-col items-center justify-center gap-1 text-center">
                    <Heading />
                    <p className="text-base md:text-lg">
                        Check-in & Connect with Friends
                    </p>
                </div>

                <AuthSection />
            </div>
        </RedirectIfAuth>
    );
}
