import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
    return (
        <div
            className={cn(
                "animate-spin rounded-full border-2 border-current border-t-transparent text-blue-600",
                {
                    "h-4 w-4 border-2": size === "sm",
                    "h-8 w-8 border-4": size === "md",
                    "h-12 w-12 border-4": size === "lg",
                },
                className
            )}
            {...props}
        >
            <span className="sr-only">Loading...</span>
        </div>
    )
}
