import { Link, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

export default function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <nav aria-label="breadcrumb" className="breadcrumb" style={{ marginBottom: "20px" }}>
            <ol className="breadcrumb-list" style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, alignItems: "center", fontSize: "14px", color: "var(--text)" }}>
                <li className="breadcrumb-item">
                    <Link to="/" style={{ textDecoration: "none", color: "var(--text)" }}>Home</Link>
                </li>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;
                    
                    // Format display name
                    const displayName = name
                        .replace(/-/g, " ")
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");

                    return (
                        <li key={name} className="breadcrumb-item" style={{ display: "flex", alignItems: "center" }}>
                            <FiChevronRight className="breadcrumb-separator" style={{ margin: "0 8px", color: "var(--border)" }} />
                            {isLast ? (
                                <span className="breadcrumb-current" style={{ color: "var(--accent)", fontWeight: "600" }}>{displayName}</span>
                            ) : (
                                <Link to={routeTo} style={{ textDecoration: "none", color: "var(--text)" }}>{displayName}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
