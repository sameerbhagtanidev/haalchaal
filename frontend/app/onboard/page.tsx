import RequireNotOnboarded from "@/components/auth/RequireNotOnboarded";

import Heading from "@/components/layout/Heading";
import InputSection from "@/components/onboard/InputSection";

export default function Onboard() {
    return (
        <RequireNotOnboarded>
            <div className="shadow-primary relative flex h-[85%] w-[85%] flex-col items-center justify-evenly rounded-lg bg-white shadow-[0_0_10px_2px] dark:bg-black">
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
