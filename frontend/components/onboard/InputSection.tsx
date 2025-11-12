"use client";

import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import InputMsg from "../ui/InputMsg";
import {
    useState,
    useEffect,
    useCallback,
    type ChangeEvent,
    type FormEvent,
} from "react";
import useDebounce from "@/hooks/useDebounce";
import axios from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";

export default function InputSection() {
    const [username, setUsername] = useState<string>("");
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const debouncedUsername = useDebounce<string>(username, 500);
    const { onboard } = useAuth();
    const router = useRouter();

    const checkUsername = useCallback(async (name: string) => {
        if (name.length < 3) {
            setIsAvailable(false);
            setMessage("Username must be at least 3 characters");
            return;
        }

        if (!/^[a-z0-9._]+$/.test(name)) {
            setIsAvailable(false);
            setMessage(
                "Only lowercase letters, numbers, dots, and underscores are allowed",
            );
            return;
        }

        setIsChecking(true);
        setMessage("");

        try {
            const response = await axios.get(
                `/api/users/check-username?username=${name}`,
            );

            const data = response.data;
            setIsAvailable(data.available);

            setMessage(data.message);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error checking username. Please try again later.";

            setIsAvailable(false);

            setMessage(message);
        } finally {
            setIsChecking(false);
        }
    }, []);

    useEffect(() => {
        if (debouncedUsername) {
            checkUsername(debouncedUsername);
        } else {
            setIsAvailable(null);
            setIsChecking(false);
            setMessage("");
        }
    }, [debouncedUsername, checkUsername]);

    function handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.toLowerCase();

        setUsername(value);
        setIsAvailable(null);
        setMessage("");
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (isChecking || !isAvailable) {
            if (!isAvailable) {
                setMessage("Please select an available username.");
            }
            return;
        }

        setIsSubmitting(true);

        try {
            await onboard(username);
            router.replace("/chat");
        } catch {
        } finally {
            setIsSubmitting(false);
        }
    }

    let msgTheme: "neutral" | "success" | "error";
    if (isChecking) {
        msgTheme = "neutral";
    } else if (isAvailable === true) {
        msgTheme = "success";
    } else if (isAvailable === false) {
        msgTheme = "error";
    } else {
        msgTheme = "neutral";
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-100 flex-col items-center justify-center gap-10"
        >
            <div className="flex w-9/10 flex-col items-start justify-center gap-1">
                <label className="text-xl">Enter Username</label>
                <Input
                    type="text"
                    placeholder="rohan2025"
                    className="text-2xl"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                    autoComplete="username"
                />
                <InputMsg theme={msgTheme}>
                    {isChecking ? "Checking availability..." : message}
                </InputMsg>
            </div>

            <Button
                type="submit"
                className={`text-2xl`}
                disabled={!isAvailable || isChecking || isSubmitting}
            >
                {isSubmitting ? "Processing..." : "Continue"}
            </Button>
        </form>
    );
}
