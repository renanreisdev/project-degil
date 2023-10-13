import { TextareaHTMLAttributes, forwardRef, useId } from "react"
import { twMerge } from "tailwind-merge"

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
    helperText?: string
    classNameDiv?: string
    classNameLabel?: string
    classNameTextArea?: string
    classNamePError?: string
}

export const TextAreaComponent = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({
        name = '',
        label = '',
        helperText = '',
        classNameDiv,
        classNameLabel,
        classNameTextArea,
        classNamePError,
        ...props
    },
        ref
    ) => {
        const inputId = useId()
        const hasErrors = helperText.length > 0

        return (
            <div className={twMerge("flex flex-col mb-2", classNameDiv)}>

                <label
                    htmlFor={inputId}
                    className={twMerge("ml-2 text-sm text-neutral-500", classNameLabel)}
                >
                    {label}
                </label>

                <textarea
                    id={inputId}
                    name={name}
                    ref={ref}
                    className={twMerge(`w-full py-1 pl-3 pr-1 rounded border bg-transparent ${hasErrors ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`, classNameTextArea)}
                    {...props}
                />

                {hasErrors && (
                    <p
                        className={twMerge("ml-2 text-xs text-red-500 font-medium", classNamePError)}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

TextAreaComponent.displayName = 'TextAreaComponent'