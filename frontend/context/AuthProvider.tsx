"use client";

import AuthContext from "./AuthContext";
import axios from "@/utils/axios";
import { toast } from "sonner";
import { useState, useEffect, type ReactNode } from "react";

import type { AxiosError } from "axios";

type AuthProviderProps = Readonly<{
    children: ReactNode;
}>;

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setsIsLoading] = useState(true);

    useEffect(() => {
        status();
    }, []);

    async function status() {
        try {
            const res = await axios.get("/api/users/status");
            if (res.data.authenticated) {
                setUser(res.data.data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setsIsLoading(false);
        }
    }

    async function sendToken(email: string): Promise<void> {
        try {
            const res = await axios.post("/api/users/send-token", { email });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error logging you in. Please try again later.";

            toast.error(message);

            throw new Error(message);
        }
    }

    async function verifyToken(
        email: string,
        loginToken: string,
    ): Promise<User> {
        try {
            const res = await axios.post("/api/users/verify-token", {
                email,
                loginToken,
            });
            if (res.data.success) {
                setUser(res.data.data.user);
            }

            return res.data.data.user;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error verifying you. Please try again later.";

            toast.error(message);

            throw new Error(message);
        }
    }

    async function onboard(username: string) {
        try {
            const res = await axios.post("/api/users/onboard", {
                username,
            });

            if (res.data.success) {
                setUser(res.data.data.user);
            }
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error onboarding you. Please try again later.";

            toast.error(message);

            throw new Error(message);
        }
    }

    async function logout() {
        setsIsLoading(true);
        try {
            await axios.post("/api/users/logout");
            setUser(null);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error logging you out. Please try again later.";

            toast.error(message);

            throw new Error(message);
        } finally {
            setsIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                status,
                sendToken,
                verifyToken,
                onboard,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
