import { HTMLAttributes, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

type NotificationsComponentProps = HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode
    size?: "flex" | "sm" | "md"
    position?: "normal" | "bottom-right" | "bottom-left"
    typeNotification?: "warning" | "processing" | "success" | "error"
    showNotification?: boolean
}

export const NotificationsComponent = ({ children, size, position, typeNotification, showNotification, className }: NotificationsComponentProps) => {
    const notificationSize = size === "sm" ? "min-w-[64px] px-4 py-2" : size === "md" ? "min-w-[290px] p-4" : "w-1/2 px-4 py-2"
    const notificationPosition = position === "bottom-right" ? "bottom-5 right-5" : position === "bottom-left" ? "bottom-5 left-5" : ""
    const notificationType = typeNotification === "success" ? "bg-green-500" : typeNotification === "error" ? "bg-red-500" : "bg-primary"
    return (
        <span
            className={twMerge(`fixed ${showNotification ? notificationPosition : position === 'bottom-right' ? '-bottom-20 right-5' : '-bottom-20 left-5'} z-30 flex justify-center items-center gap-3 ${notificationSize} text-white ${notificationType} rounded shadow-sm transition-all ease-in-out duration-1000`, className)}
        >
            {children}
        </span>
    )
}