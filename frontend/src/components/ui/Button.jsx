import { FiLoader } from "react-icons/fi";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    onClick,
    ...props
}) {
    const baseStyle = "inline-flex items-center justify-center font-semibold rounded-button cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
    
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-dark shadow-sm border border-transparent",
        secondary: "bg-primary-light text-primary hover:bg-primary/20 border border-transparent",
        outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary-light",
        success: "bg-secondary text-white hover:bg-secondary/90 shadow-sm border border-transparent",
        danger: "bg-danger text-white hover:bg-danger/90 shadow-sm border border-transparent",
        ghost: "bg-transparent text-text hover:bg-code-bg border border-transparent",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3 text-base",
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && <FiLoader className="animate-spin mr-2" size={16} />}
            {children}
        </button>
    );
}
