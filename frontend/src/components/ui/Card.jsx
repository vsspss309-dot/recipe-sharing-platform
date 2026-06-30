export default function Card({ children, className = "", hover = true, ...props }) {
    return (
        <div 
            className={`bg-bg border border-border rounded-card transition-all duration-200 overflow-hidden text-left
                ${hover ? "hover:shadow-md hover:-translate-y-0.5" : "shadow-sm"}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "" }) {
    return <div className={`p-5 pb-3 border-b border-border ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
    return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
    return <div className={`p-5 pt-3 border-t border-border ${className}`}>{children}</div>;
}
