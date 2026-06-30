export default function Switch({
    label,
    checked = false,
    onChange,
    disabled = false,
    className = "",
    ...props
}) {
    return (
        <label className={`flex items-center gap-3 cursor-pointer select-none text-left ${className}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="sr-only peer"
                    {...props}
                />
                <div className={`w-10 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors duration-200
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}></div>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm
                    peer-checked:translate-x-4
                    ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
                `}></div>
            </div>
            {label && (
                <span className={`text-sm font-medium text-text-h ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                    {label}
                </span>
            )}
        </label>
    );
}
