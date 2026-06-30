export default function Skeleton({
    variant = "text",
    width,
    height,
    className = "",
    ...props
}) {
    const baseStyle = "animate-pulse bg-border/60 rounded-small";
    
    const variants = {
        text: "h-3 w-full my-2",
        avatar: "rounded-full shrink-0",
        rect: "w-full rounded-medium",
    };

    return (
        <div
            className={`${baseStyle} ${variants[variant]} ${className}`}
            style={{ width, height }}
            {...props}
        ></div>
    );
}
