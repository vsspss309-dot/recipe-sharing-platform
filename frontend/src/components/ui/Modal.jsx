import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md"
}) {
    // Prevent body scroll when modal is active
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
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl"
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" 
                onClick={onClose}
            ></div>
            
            {/* Modal Box */}
            <div className={`relative bg-bg border border-border w-full rounded-card shadow-lg z-10 overflow-hidden transform transition-all duration-200 scale-100 ${sizes[size]}`}>
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-border">
                    <h3 className="text-lg font-bold text-text-h font-heading">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-text/60 hover:text-text-h p-1.5 rounded-full hover:bg-code-bg cursor-pointer transition-colors"
                        aria-label="Close modal"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 max-h-[65vh] overflow-y-auto text-left text-sm text-text">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-code-bg/10">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
