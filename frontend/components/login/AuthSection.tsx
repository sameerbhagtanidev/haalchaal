"use client";

import { useState } from "react";
import ButtonsSection from "@/components/login/ButtonsSection";
import EmailSection from "@/components/login/EmailSection";
import VerifySection from "./VerifySection";

export default function AuthSection() {
    const [container, setContainer] = useState<"buttons" | "email" | "verify">(
        "buttons",
    );
    const [email, setEmail] = useState<string>("");

    return (
        <>
            {container === "buttons" && (
                <>
                    <h2 className="text-primary text-center text-4xl font-bold">
                        Login or Join
                    </h2>

                    <ButtonsSection setContainer={setContainer} />
                </>
            )}
            {container === "email" && (
                <EmailSection setContainer={setContainer} setEmail={setEmail} />
            )}
            {container === "verify" && <VerifySection email={email} />}
        </>
    );
}
