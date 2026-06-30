import { useEffect } from "react";
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

export default function Toast({
    message,
    type = "success",
    duration = 3500,
    onClose,
    isOpen
}) {
    useEffect(() => {
        if (isOpen && duration > 0 && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const icons = {
        success: <FiCheckCircle className="text-secondary" size={18} />,
        error: <FiAlertCircle className="text-danger" size={18} />,
        warning: <FiAlertCircle size={18} style={{ color: "#FBBF24" }} />,
        info: <FiInfo className="text-info" size={18} />
    };

    const borders = {
        success: "border-secondary/40",
        error: "border-danger/40",
        warning: "border-warning/40",
        info: "border-info/40"
    };

    return (
        <div className={`fixed bottom-6 right-6 z-[5000] flex items-center gap-3 bg-bg border rounded-medium px-4 py-3.5 shadow-lg min-w-[280px] max-w-sm transition-all duration-300 ${borders[type]}`}
             style={{
                 animation: "slideInRight 0.3s ease-out-back"
             }}>
            <span className="shrink-0">{icons[type]}</span>
            <div className="flex-1 text-xs font-semibold text-text-h text-left">
                {message}
            </div>
            {onClose && (
                <button 
                    onClick={onClose} 
                    className="text-text/50 hover:text-text-h p-1 hover:bg-code-bg rounded-full transition-colors cursor-pointer"
                    aria-label="Close notification"
                >
                    <FiX size={14} />
                </button>
            )}
        </div>
    );
}
