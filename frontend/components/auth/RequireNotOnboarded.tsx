"use client";

import { type PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Loader from "../ui/Loader";

export default function RequireNotOnboarded({ children }: PropsWithChildren) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.replace("/login");
        } else if (user && user.username) {
            router.replace("/chat");
        }
    }, [isLoading, user, router]);

    if (isLoading) return <Loader />;
    if (!user || (user && user.username)) return null;

    return <>{children}</>;
}
