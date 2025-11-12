"use client";

import { useId } from "react";
import type { Dispatch, SetStateAction } from "react";

import InputMsg from "../ui/InputMsg";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authSchema } from "@/validation/user";
import useAuth from "@/hooks/useAuth";

type FormData = z.infer<typeof authSchema>;

type ContinueButtonsProps = Readonly<{
    setContainer: Dispatch<SetStateAction<"email" | "buttons" | "verify">>;
    setEmail: Dispatch<SetStateAction<string>>;
}>;

export default function EmailSection({
    setContainer,
    setEmail,
}: ContinueButtonsProps) {
    const emailInputId = useId();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onTouched",
        resolver: zodResolver(authSchema),
    });

    const { sendToken } = useAuth();

    async function onSubmit(formData: FormData) {
        if (isSubmitting) return;

        try {
            const email = formData["email"];
            await sendToken(email);

            setEmail(email);
            setContainer("verify");
        } catch {}
    }

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full max-w-100 flex-col items-center justify-center gap-10"
            >
                <div className="flex w-9/10 flex-col items-start justify-center gap-1">
                    <label className="text-xl" htmlFor={emailInputId}>
                        Enter Email
                    </label>
                    <Input
                        type="text"
                        placeholder="rohan@gmail.com"
                        className="text-2xl"
                        id={emailInputId}
                        autoComplete="email"
                        {...register("email")}
                    />

                    {errors.email && (
                        <InputMsg theme="error">
                            {errors.email.message}
                        </InputMsg>
                    )}
                </div>

                <div className="flex w-full flex-wrap items-center justify-evenly gap-2">
                    <Button
                        type="button"
                        className="text-2xl"
                        onClick={() => setContainer("buttons")}
                        disabled={isSubmitting}
                    >
                        Go back
                    </Button>
                    <Button
                        type="submit"
                        className="text-2xl"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Processing..." : "Continue"}
                    </Button>
                </div>
            </form>
        </>
    );
}
