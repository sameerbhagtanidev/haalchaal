"use client";

import { Button } from "@/components/ui/button";
import { IoMail } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";

import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

type ContinueButtonsProps = Readonly<{
    setContainer: Dispatch<SetStateAction<"email" | "buttons" | "verify">>;
}>;

export default function ButtonsSection({ setContainer }: ContinueButtonsProps) {
    const router = useRouter();
    function handleGoogleLogin() {
        router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/google`);
    }

    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <Button
                type="button"
                className="w-full justify-center py-5! text-2xl md:px-10!"
                onClick={() => setContainer("email")}
            >
                <IoMail className="size-6 md:size-7" /> Continue with Email
            </Button>

            <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full justify-center py-5! text-2xl md:px-10!"
            >
                <FaGoogle className="size-6 md:size-7" /> Continue with Google
            </Button>
        </div>
    );
}
