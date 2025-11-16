import type { ReactNode } from "react";
import clsx from "clsx";
import { FaCheckDouble, FaCheck } from "react-icons/fa6";

type ChatBubbleProps = {
    children: ReactNode;
    time: string;
    seen?: boolean;
    sent?: boolean;
    skeleton?: boolean;
    pending?: boolean;
};

export default function ChatBubble({
    children,
    time,
    seen = false,
    sent = false,
    skeleton = false,
    pending = false,
}: ChatBubbleProps) {
    return (
        <div
            className={clsx(
                `flex max-w-6/10 flex-col gap-1 rounded-lg bg-gray-300 px-3 py-2 whitespace-pre-wrap dark:bg-gray-800`,
                {
                    "self-end text-right": sent === true,
                    "self-start text-left": sent === false,
                    "min-h-10 min-w-4/10 animate-pulse": skeleton === true,
                },
            )}
        >
            {!skeleton && (
                <>
                    <span>{children}</span>
                    <div className="flex items-center justify-center gap-0.5 self-end text-xs">
                        <span>{time}</span>
                        <span>
                            {pending && sent && <FaCheck />}
                            {!pending && sent && (
                                <FaCheckDouble
                                    className={clsx({ "text-primary": seen })}
                                />
                            )}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
