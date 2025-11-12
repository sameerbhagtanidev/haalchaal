"use client";

type SkeletonRowProps = {
    className?: string;
    withAvatar?: boolean;
    lines?: number;
};

export default function SkeletonRow({
    className = "",
    withAvatar = false,
    lines = 1,
}: SkeletonRowProps) {
    return (
        <div
            className={`flex items-center gap-3 px-3 py-2 ${className}`}
            aria-hidden="true"
        >
            {withAvatar && (
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            )}

            <div className="min-w-0 flex-1">
                <div className="mb-2 h-3 w-3/4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                {lines === 2 && (
                    <div className="h-2 w-1/2 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                )}
            </div>

            <div className="h-7 w-7 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
    );
}
