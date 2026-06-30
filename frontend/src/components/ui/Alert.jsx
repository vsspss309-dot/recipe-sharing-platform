import { FiCheckCircle, FiAlertTriangle, FiInfo, FiAlertCircle } from "react-icons/fi";

export default function Alert({
    children,
    title,
    variant = "info",
    className = "",
    ...props
}) {
    const icons = {
        success: <FiCheckCircle className="text-secondary shrink-0" size={20} />,
        warning: <FiAlertTriangle className="text-warning shrink-0" size={20} style={{ color: "#D97706" }} />,
        info: <FiInfo className="text-info shrink-0" size={20} />,
        danger: <FiAlertCircle className="text-danger shrink-0" size={20} />
    };

    const containerStyle = {
        success: "bg-secondary/10 border-secondary/25 text-secondary-dark",
        warning: "bg-warning/10 border-warning/25 text-warning-dark",
        info: "bg-info/10 border-info/25 text-info-dark",
        danger: "bg-danger/10 border-danger/25 text-danger-dark"
    };

    return (
        <div
            className={`flex gap-3.5 border rounded-medium p-4 text-left text-sm ${containerStyle[variant]} ${className}`}
            style={
                variant === "warning" 
                    ? { color: "#92400E", borderColor: "rgba(217, 119, 6, 0.25)" } 
                    : undefined
            }
            {...props}
        >
            <span>{icons[variant]}</span>
            <div className="flex flex-col gap-1 flex-1">
                {title && <h5 className="font-bold m-0 leading-tight">{title}</h5>}
                <div className="leading-relaxed opacity-90">{children}</div>
            </div>
        </div>
    );
}
