import type { ReactNode } from "react";
import clsx from "clsx";

type InputMsgProps = Readonly<{
    children: ReactNode;
    theme?: "success" | "error" | "neutral";
    className?: string;
}>;

export default function InputMsg({
    children,
    theme = "neutral",
    className = "",
}: InputMsgProps) {
    let themeClass = "";
    if (theme === "success") {
        themeClass = "text-green-500";
    } else if (theme === "error") {
        themeClass = "text-red-500";
    }

    return (
        <p className={clsx(`w-9/10 text-start text-sm`, className, themeClass)}>
            {children}
        </p>
    );
}
