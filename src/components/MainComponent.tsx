import { HTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

type MainComponentProps = HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
}

export const MainComponent = ({ children, className }: MainComponentProps) => {
    return (
        <main className={twMerge(`flex flex-col p-3 sm:px-10`, className)}>
            {children}
        </main>
    )
}