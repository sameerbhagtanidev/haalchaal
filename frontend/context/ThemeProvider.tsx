"use client";

import ThemeContext, { type Theme } from "./ThemeContext";
import { useState, useEffect, type ReactNode } from "react";

type ThemeProviderProps = Readonly<{
    children: ReactNode;
}>;

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as Theme | null;

        const systemPreference: Theme = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches
            ? "dark"
            : "light";

        const initialTheme = storedTheme || systemPreference;

        setTheme(initialTheme);
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;

        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme, hydrated]);

    function toggleTheme() {
        setTheme((oldTheme) => (oldTheme === "light" ? "dark" : "light"));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
