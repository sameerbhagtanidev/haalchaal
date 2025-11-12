"use client";

import { type PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Loader from "../ui/Loader";

export default function RedirectIfAuth({ children }: PropsWithChildren) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (user && !user.username) {
            router.replace("/onboard");
        } else if (user) {
            router.replace("/chat");
        }
    }, [isLoading, user, router]);

    if (isLoading) return <Loader />;
    if (user) return null;

    return <>{children}</>;
}
