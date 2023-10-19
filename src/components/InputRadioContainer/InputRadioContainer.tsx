type InputRadioContainerProps = {
    children: React.ReactNode
    label?: string
    helperText?: string
}

export const InputRadioContainer = ({ children, label = '', helperText = '' }: InputRadioContainerProps) => {
    const hasErrors = helperText.length > 0
    return (
        <div className="flex flex-col mb-2 xs:col-span-4">
            <label className="ml-2 text-sm text-neutral-500">{label}</label>
            <div className="flex flex-wrap gap-3">
                {children}
            </div>
            {hasErrors && (
                <p className="ml-2 text-xs text-red-500 font-medium">{helperText}</p>
            )}
        </div>
    )
}