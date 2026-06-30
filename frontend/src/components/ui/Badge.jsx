export default function Badge({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}) {
    const baseStyle = "inline-flex items-center justify-center font-semibold rounded-full";
    
    const variants = {
        primary: "bg-primary-light text-primary",
        secondary: "bg-code-bg text-text",
        success: "bg-secondary/15 text-secondary",
        warning: "bg-warning/15 text-warning-dark", // wait, warning is yellow, let's use warning/15 background and dark warning text
        danger: "bg-danger/15 text-danger",
        info: "bg-info/15 text-info",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
    };

    return (
        <span
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            style={variant === "warning" ? { color: "#D97706" } : undefined}
            {...props}
        >
            {children}
        </span>
    );
}
