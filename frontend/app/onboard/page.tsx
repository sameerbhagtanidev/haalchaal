import RequireNotOnboarded from "@/components/auth/RequireNotOnboarded";

import Heading from "@/components/layout/Heading";
import InputSection from "@/components/onboard/InputSection";

export default function Onboard() {
    return (
        <RequireNotOnboarded>
            <div className="border-primary relative flex h-[85%] min-h-100 w-[85%] flex-col items-center justify-evenly rounded-lg border-2 bg-white dark:bg-black">
                <div className="flex flex-col items-center justify-center gap-1 text-center">
                    <Heading />
                    <p className="text-base md:text-lg">
                        Check-in & Connect with Friends
                    </p>
                </div>

                <h2 className="text-primary mx-3 text-center text-4xl font-bold">
                    Let&apos;s get you onboard
                </h2>

                <InputSection />
            </div>
        </RequireNotOnboarded>
    );
}
