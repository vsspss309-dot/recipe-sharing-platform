export default function Spinner({
    size = "md",
    variant = "primary",
    className = "",
    ...props
}) {
    const sizes = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    };

    const variants = {
        primary: "border-primary/25 border-t-primary",
        secondary: "border-secondary/25 border-t-secondary",
        white: "border-white/25 border-t-white",
        gray: "border-border border-t-text/50"
    };

    return (
        <div
            className={`rounded-full animate-spin shrink-0 ${sizes[size]} ${variants[variant]} ${className}`}
            {...props}
        ></div>
    );
}
