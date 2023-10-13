import { SelectHTMLAttributes, forwardRef, useId } from "react"
import { twMerge } from "tailwind-merge"

type SelectOptionComponentProps = SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string
    labelOption?: string
    helperText?: string
    classNameDiv?: string
    classNameLabel?: string
    classNameSelect?: string
    classNamePError?: string
    options: { value: string, label: string }[]
}

export const SelectOptionComponent = forwardRef<HTMLSelectElement, SelectOptionComponentProps>(
    (
        {
            label = '',
            labelOption = 'Selecionar...',
            helperText = '',
            classNameDiv,
            classNameLabel,
            classNameSelect,
            classNamePError,
            options,
            ...props
        },
        ref
    ) => {
        const selectId = useId()
        const hasErrors = helperText.length > 0
        return (
            <div className={twMerge("flex flex-col mb-2", classNameDiv)}>
                <label htmlFor={selectId} className={twMerge("ml-2 text-sm text-neutral-500", classNameLabel)}>{label}</label>
                <select
                    id={selectId}
                    className={twMerge(`w-full h-[36px] py-1 pl-3 pr-1 rounded border bg-transparent ${hasErrors ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`, classNameSelect)}
                    ref={ref}
                    {...props}
                >
                    <option key={"defaultValue"} value={""} disabled selected>
                        {labelOption}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

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

SelectOptionComponent.displayName = "SelectOptionComponent"