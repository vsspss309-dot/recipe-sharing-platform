import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Drawer({
    isOpen,
    onClose,
    title,
    children,
    position = "right",
    size = "md"
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: "w-80",
        md: "w-96",
        lg: "w-[480px]",
        xl: "w-[640px]"
    };

    const positionClasses = {
        left: "left-0 h-full border-r",
        right: "right-0 h-full border-l"
    };

    return (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" 
                onClick={onClose}
            ></div>

            {/* Panel Drawer */}
            <div className={`absolute top-0 bg-bg border-border flex flex-col shadow-lg z-10 h-full transition-transform duration-300 ${positionClasses[position]} ${sizes[size]}`}>
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-border">
                    <h3 className="text-lg font-bold text-text-h font-heading">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-text/60 hover:text-text-h p-1.5 rounded-full hover:bg-code-bg cursor-pointer transition-colors"
                        aria-label="Close drawer"
                    >
                        <FiX size={18} />
                    </button>
                </div>
                {/* Scrollable Content */}
                <div className="flex-1 p-6 overflow-y-auto text-left text-sm text-text">
                    {children}
                </div>
            </div>
        </div>
    );
}
