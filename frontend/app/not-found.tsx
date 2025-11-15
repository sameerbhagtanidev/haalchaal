import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="border-primary relative flex h-[85%] min-h-100 w-[85%] flex-col items-center justify-center gap-10 rounded-lg border-2 bg-white dark:bg-black">
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
