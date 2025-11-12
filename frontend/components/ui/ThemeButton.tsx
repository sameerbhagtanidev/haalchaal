"use client";

import clsx from "clsx";
import { Button } from "./button";
import { VscColorMode } from "react-icons/vsc";
import useTheme from "@/hooks/useTheme";

type ThemeButtonProps = Readonly<{
    className?: string;
}>;

export default function ThemeButton({ className }: ThemeButtonProps) {
    const { toggleTheme } = useTheme();

    return (
        <Button
            type="button"
            onClick={toggleTheme}
            className={clsx("fixed top-3 right-3 cursor-pointer", className)}
            aria-label="Toggle theme"
            variant="ghost"
        >
            <VscColorMode className="size-7" />
        </Button>
    );
}
