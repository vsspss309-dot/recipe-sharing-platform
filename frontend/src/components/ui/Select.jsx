export default function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    helperText,
    disabled = false,
    className = "",
    placeholder = "Select an option",
    ...props
}) {
    return (
        <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-text-h">
                    {label}
                </label>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-4 py-3 rounded-button border text-sm transition-all bg-bg text-text-h focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none
                    ${error 
                        ? "border-danger focus:border-danger focus:ring-danger/20" 
                        : "border-border focus:border-primary focus:ring-primary/20"
                    }
                    disabled:opacity-50 disabled:bg-code-bg disabled:cursor-not-allowed
                `}
                style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '16px'
                }}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
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
