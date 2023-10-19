import { HTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

type NotificationsComponentProps = HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode
    size?: "flex" | "sm" | "md"
    position?: "normal" | "bottom-right" | "bottom-left"
}

export const NotificationsComponent = ({ children, size, position, className }: NotificationsComponentProps) => {
    const notificationSize = size === "sm" ? "min-w-[64px] px-4 py-2" : size === "md" ? "min-w-[128px] p-4" : "w-1/2 px-4 py-2"
    const notificationPosition = position === "bottom-right" ? "fixed bottom-5 right-5" : position === "bottom-left" ? "fixed bottom-5 left-5" : ""
    return (
        <span
            className={twMerge(`z-50 ${notificationPosition} flex justify-center items-center gap-3 ${notificationSize} text-white bg-primary rounded shadow-sm`, className)}
        >
            {children}
        </span>
    )
}