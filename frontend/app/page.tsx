import Link from "next/link";

import { Button } from "@/components/ui/button";
import Heading from "@/components/layout/Heading";

import { FaGithub } from "react-icons/fa";
import { IoChatbubble } from "react-icons/io5";

export default function Home() {
    return (
        <div className="shadow-primary relative flex h-[85%] w-[85%] flex-col items-center justify-evenly rounded-lg bg-white shadow-[0_0_10px_2px] dark:bg-black">
            <div className="flex flex-col items-center justify-center gap-1 text-center">
                <Heading />
                <p className="text-base md:text-lg">
                    Check-in & Connect with Friends
                </p>
            </div>

            <p className="mx-5 max-w-200 text-center text-base md:text-lg">
                Ask your friends about their &apos;HaalChaal&apos; (well-being)!
                HaalChaal is your new platform for instant messaging. Easily
                find users, send friend requests, and start chatting.
            </p>

            <div className="flex flex-col items-center justify-center gap-5 md:flex-row">
                <Button className="w-full text-2xl md:w-8/10">
                    <Link
                        href="/login"
                        className="flex w-full items-center justify-center gap-3"
                    >
                        <IoChatbubble className="size-6" />
                        Chat now
                    </Link>
                </Button>

                <Button className="w-full text-2xl md:w-8/10">
                    <Link
                        href="/"
                        className="flex w-full items-center justify-center gap-3"
                    >
                        <FaGithub className="size-6" />
                        GitHub
                    </Link>
                </Button>
            </div>
        </div>
    );
}
