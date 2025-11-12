"use client";

import { useEffect } from "react";

export default function Loader() {
    useEffect(() => {
        const originalStyle = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 z-1000 flex h-dvh w-dvw items-center justify-center bg-white dark:bg-black">
            <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
    );
}
