import { useState } from "react";

export default function Avatar({
    src,
    name = "User",
    size = "md",
    className = "",
    ...props
}) {
    const [imgFailed, setImgFailed] = useState(false);

    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-base",
        xl: "w-24 h-24 text-xl",
    };

    // Calculate initials
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    // Use nice background colors based on name hash for consistent avatar color
    const getBgColor = (text) => {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = [
            "bg-primary",
            "bg-secondary",
            "bg-info",
            "bg-danger",
            "bg-warning"
        ];
        // Note warning dark color support
        const colorIdx = Math.abs(hash) % colors.length;
        return colors[colorIdx];
    };

    const isWarning = getBgColor(name) === "bg-warning";

    return (
        <div
            className={`relative flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none border-2 border-border bg-code-bg
                ${sizes[size]}
                ${className}
            `}
            {...props}
        >
            {src && !imgFailed ? (
                <img
                    src={src}
                    alt={name}
                    onError={() => setImgFailed(true)}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div 
                    className={`w-full h-full flex items-center justify-center font-bold text-white ${getBgColor(name)}`}
                    style={isWarning ? { backgroundColor: "#F59E0B" } : undefined}
                >
                    {initials || "?"}
                </div>
            )}
        </div>
    );
}
