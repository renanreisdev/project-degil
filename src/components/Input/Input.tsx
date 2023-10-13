import { InputHTMLAttributes, forwardRef, useId } from "react"
import { twMerge } from "tailwind-merge"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    isRadioInput?: boolean
    helperText?: string
    classNameDiv?: string
    classNameLabel?: string
    classNameInput?: string
    classNamePError?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { type = 'text', name = '', label = '', isRadioInput, helperText = '', classNameDiv, classNameLabel, classNameInput, classNamePError, ...props }, ref
    ) => {
        const inputId = useId()
        const hasErrors = helperText.length > 0

        return (
            <div className={isRadioInput ? twMerge(`group relative flex justify-center items-center w-24 h-[34px] border rounded ${hasErrors ? 'border-red-500' : 'border-slate-400'} transition-all ease-in-out duration-300 hover:bg-[#ed631d] hover:border-transparent`, classNameDiv) : twMerge("flex flex-col mb-2", classNameDiv)}>

                {!isRadioInput && (
                    <label
                        htmlFor={inputId}
                        className={twMerge("ml-2 text-sm text-neutral-500", classNameLabel)}
                    >
                        {label}
                    </label>
                )}

                <input
                    id={inputId}
                    type={type}
                    name={name}
                    ref={ref}
                    className={isRadioInput ? twMerge(`peer absolute left-0 top-0 w-0 h-0`) : twMerge(`w-full py-1 pl-3 pr-1 rounded border bg-transparent ${hasErrors ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`, classNameInput)}
                    {...props}
                />

                {isRadioInput && (
                    <label
                        htmlFor={inputId}
                        className={isRadioInput ? twMerge("z-10 text-xs text-center text-neutral-500 cursor-pointer group-hover:text-white peer-checked:text-white", classNameLabel) : twMerge("ml-2 -mb-[2px] text-sm text-neutral-500", classNameLabel)}
                    >
                        {label}
                    </label>
                )}

                {isRadioInput && (
                    <label htmlFor={inputId} className="absolute w-24 h-[34px] rounded opacity-0 cursor-pointer peer-checked:bg-[#ed631d] peer-checked:opacity-100"></label>
                )}

                {hasErrors && !isRadioInput && (
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

Input.displayName = 'InputComponent'