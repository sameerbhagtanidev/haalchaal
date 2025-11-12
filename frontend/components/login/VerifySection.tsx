"use client";

import { Button } from "../ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import { REGEXP_ONLY_DIGITS } from "input-otp";

type VerifySectionProps = Readonly<{
    email: string;
}>;

export default function VerifySection({ email }: VerifySectionProps) {
    const [loginToken, setLoginToken] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { verifyToken } = useAuth();
    const router = useRouter();

    async function handleSubmit() {
        try {
            if (loginToken.length !== 6) {
                toast.error("Please enter a valid OTP");
                return;
            }

            if (isSubmitting) return;
            setIsSubmitting(true);

            const user = await verifyToken(email, loginToken);

            if (user!.username) {
                router.replace("/chat");
            } else {
                router.replace("/onboard");
            }
        } catch {
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-10">
                <div className="flex flex-col items-start justify-center gap-1">
                    <label className="text-xl">Enter OTP</label>
                    <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={loginToken}
                        onChange={(value) => setLoginToken(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot
                                className="size-12 text-2xl"
                                index={0}
                            />
                            <InputOTPSlot
                                className="size-12 text-2xl"
                                index={1}
                            />
                            <InputOTPSlot
                                className="size-12 text-2xl"
                                index={2}
                            />
                            <InputOTPSlot
                                className="size-12 text-2xl"
                                index={3}
                            />
                            <InputOTPSlot
                                className="size-12 text-2xl"
                                index={4}
                            />
                            <InputOTPSlot
                                className="size-12 text-2xl"
                                index={5}
                            />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <div className="flex w-full items-center justify-evenly">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="text-2xl"
                        disabled={isSubmitting || loginToken.length != 6}
                    >
                        {isSubmitting ? "Processing..." : "Continue"}
                    </Button>
                </div>
            </div>
        </>
    );
}
