export default function Radio({
    label,
    name,
    value,
    checked = false,
    onChange,
    disabled = false,
    className = "",
    ...props
}) {
    return (
        <label className={`flex items-center gap-3 cursor-pointer select-none text-left ${className}`}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="sr-only peer"
                {...props}
            />
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all bg-bg
                peer-checked:border-primary peer-checked:bg-white
                ${disabled ? "opacity-50 cursor-not-allowed bg-code-bg" : "cursor-pointer"}
                border-border hover:border-primary/50
            `}>
                <span className="w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform"></span>
            </span>
            {label && (
                <span className={`text-sm font-medium text-text-h ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                    {label}
                </span>
            )}
        </label>
    );
}
