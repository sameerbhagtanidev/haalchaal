"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function Error() {
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get("msg");

    return (
        <div className="border-primary relative flex h-[85%] min-h-100 w-[85%] flex-col items-center justify-center gap-10 rounded-lg border-2 bg-white dark:bg-black">
            <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-primary text-center text-4xl">Error:</h1>
                <p className="text-xl text-red-500">{errorMessage}</p>
            </div>

            <Button asChild type="button" className="text-2xl">
                <Link href="/" replace>
                    Go to Home
                </Link>
            </Button>
        </div>
    );
}
