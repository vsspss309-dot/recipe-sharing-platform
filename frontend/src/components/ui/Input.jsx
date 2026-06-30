export default function Input({
    label,
    type = "text",
    name,
    placeholder,
    value,
    onChange,
    error,
    helperText,
    disabled = false,
    className = "",
    icon,
    ...props
}) {
    return (
        <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-text-h">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && (
                    <span className="absolute left-4 text-text/60">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full px-4 py-3 rounded-button border text-sm transition-all bg-bg text-text-h focus:outline-none focus:ring-2 focus:ring-primary/20
                        ${icon ? "pl-11" : ""}
                        ${error 
                            ? "border-danger focus:border-danger focus:ring-danger/20" 
                            : "border-border focus:border-primary focus:ring-primary/20"
                        }
                        disabled:opacity-50 disabled:bg-code-bg disabled:cursor-not-allowed
                    `}
                    {...props}
                />
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
