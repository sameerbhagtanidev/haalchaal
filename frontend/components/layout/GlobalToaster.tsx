"use client";

import { Toaster } from "sonner";
import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function GlobalToaster() {
    const { theme } = useTheme();

    return (
        <Toaster
            position="bottom-center"
            theme={theme}
            closeButton={true}
            toastOptions={{
                classNames: {
                    title: "text-lg",
                    icon: "size-7",
                },
            }}
            icons={{
                success: <CircleCheckIcon className="size-6 text-green-500" />,
                info: <InfoIcon className="size-6" />,
                warning: (
                    <TriangleAlertIcon className="size-6 text-yellow-500" />
                ),
                error: <OctagonXIcon className="size-6 text-red-500" />,
                loading: <Loader2Icon className="size-6 animate-spin" />,
            }}
        />
    );
}
