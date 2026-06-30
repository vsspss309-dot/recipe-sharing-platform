import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    className = "",
    ...props
}) {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav
            aria-label="Pagination Navigation"
            className={`flex items-center justify-center gap-2 mt-6 ${className}`}
            {...props}
        >
            {/* Previous button */}
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-border rounded-button bg-bg text-text hover:bg-code-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                aria-label="Previous Page"
            >
                <FiChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    type="button"
                    onClick={() => onPageChange(number)}
                    aria-current={currentPage === number ? "page" : undefined}
                    className={`w-9 h-9 flex items-center justify-center font-semibold rounded-button text-sm cursor-pointer transition-colors
                        ${currentPage === number
                            ? "bg-primary text-white"
                            : "bg-bg text-text border border-border hover:bg-code-bg"
                        }
                    `}
                >
                    {number}
                </button>
            ))}

            {/* Next button */}
            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-border rounded-button bg-bg text-text hover:bg-code-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                aria-label="Next Page"
            >
                <FiChevronRight size={16} />
            </button>
        </nav>
    );
}
