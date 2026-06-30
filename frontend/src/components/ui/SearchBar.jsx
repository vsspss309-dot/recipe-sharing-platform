import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar({
    value = "",
    onChange,
    onClear,
    placeholder = "Search recipes, ingredients...",
    className = "",
    ...props
}) {
    return (
        <div className={`relative flex items-center w-full max-w-lg ${className}`} {...props}>
            <span className="absolute left-4 text-text/60">
                <FiSearch size={18} />
            </span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full pl-11 pr-11 py-3 bg-bg border border-border rounded-button text-sm text-text-h placeholder-text/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
            />
            {value && onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-4 text-text/50 hover:text-text-h p-0.5 hover:bg-code-bg rounded-full transition-colors cursor-pointer"
                    aria-label="Clear search"
                >
                    <FiX size={16} />
                </button>
            )}
        </div>
    );
}
