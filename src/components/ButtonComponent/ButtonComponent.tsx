import { ButtonHTMLAttributes, forwardRef } from "react"
import { twMerge } from "tailwind-merge"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    buttonModel?: "solid" | "outline"
    buttonSize?: "flex" | "sm" | "md"
    description?: string
    uppercase?: boolean
}

export const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        type = "submit",
        className,
        buttonModel,
        buttonSize,
        description = 'Enviar',
        uppercase,
        ...props
    }, ref) => {
        const size = buttonSize === "sm" ? "min-w-[64px] px-4 py-2" : buttonSize === "md" ? "min-w-[128px] p-4" : "w-1/2 px-4 py-2"

        return (
            <button
                type={type}
                ref={ref}
                className={buttonModel === "outline" ? twMerge(`${size} text-hover font-semibold border border-hover bg-transparent rounded-lg transition-all duration-300 hover:bg-hover hover:text-white`, className) : twMerge(`${size} text-white bg-secondary rounded-lg hover:bg-hover transition-all duration-300`, className)}
                {...props}
            >
                {description}
            </button >
        )
    }
)

ButtonComponent.displayName = 'ButtonComponent'