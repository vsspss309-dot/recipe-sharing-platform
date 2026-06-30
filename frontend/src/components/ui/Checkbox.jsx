export default function Checkbox({
    label,
    name,
    checked = false,
    onChange,
    disabled = false,
    error,
    className = "",
    ...props
}) {
    return (
        <div className={`flex flex-col gap-1 text-left ${className}`}>
            <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="sr-only peer"
                    {...props}
                />
                <span className={`w-5 h-5 rounded-small border flex items-center justify-center transition-all bg-bg
                    peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white
                    peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20
                    ${error ? "border-danger" : "border-border hover:border-primary/50"}
                    ${disabled ? "opacity-50 cursor-not-allowed bg-code-bg" : "cursor-pointer"}
                `}>
                    <svg
                        className="w-3.5 h-3.5 fill-none stroke-current opacity-0 peer-checked:opacity-100 transition-opacity"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </span>
                {label && (
                    <span className={`text-sm font-medium text-text-h ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                        {label}
                    </span>
                )}
            </label>
            {error && (
                <span className="text-xs font-medium text-danger pl-8">
                    {error}
                </span>
            )}
        </div>
    );
}
