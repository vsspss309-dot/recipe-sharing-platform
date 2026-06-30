export default function Container({ children, className = "", size = "md" }) {
    const sizeClasses = {
        sm: "max-w-3xl",
        md: "max-w-5xl",
        lg: "max-w-7xl",
        full: "max-w-full"
    };

    return (
        <div className={`mx-auto px-4 w-full box-border ${sizeClasses[size]} ${className}`}>
            {children}
        </div>
    );
}
