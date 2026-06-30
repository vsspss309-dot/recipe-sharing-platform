export default function Textarea({
    label,
    name,
    placeholder,
    value = "",
    onChange,
    error,
    helperText,
    disabled = false,
    rows = 4,
    maxLength,
    className = "",
    ...props
}) {
    return (
        <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-text-h">
                    {label}
                </label>
            )}
            <div className="relative">
                <textarea
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    rows={rows}
                    maxLength={maxLength}
                    className={`w-full px-4 py-3 rounded-button border text-sm transition-all bg-bg text-text-h focus:outline-none focus:ring-2 focus:ring-primary/20
                        ${error 
                            ? "border-danger focus:border-danger focus:ring-danger/20" 
                            : "border-border focus:border-primary focus:ring-primary/20"
                        }
                        disabled:opacity-50 disabled:bg-code-bg disabled:cursor-not-allowed
                    `}
                    {...props}
                />
                {maxLength && (
                    <span className="absolute bottom-2.5 right-3 text-[10px] text-text/50">
                        {value.length} / {maxLength}
                    </span>
                )}
            </div>
            {error && (
                <span className="text-xs font-medium text-danger flex items-center gap-1">
                    ❌ {error}
                </span>
            )}
            {!error && helperText && (
                <span className="text-xs text-text/70">
                    {helperText}
                </span>
            )}
        </div>
    );
}
