import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="shadow-primary relative flex h-[85%] w-[85%] flex-col items-center justify-center gap-10 rounded-lg bg-white shadow-[0_0_10px_2px] dark:bg-black">
            <h1 className="text-primary text-center text-4xl">
                Page not found!
            </h1>

            <Button asChild type="button" className="text-2xl">
                <Link href="/" replace>
                    Go to Home
                </Link>
            </Button>
        </div>
    );
}
