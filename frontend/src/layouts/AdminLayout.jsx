import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiFileText, FiMessageSquare, FiAlertTriangle, FiPieChart, FiSettings, FiGrid, FiLogOut, FiHome } from "react-icons/fi";
import api, { setAccessToken } from "../utils/api";

export default function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            setAccessToken("");
            window.location.href = "/login";
        }
    };

    const navItems = [
        { path: "/admin/dashboard", icon: <FiPieChart />, label: "Dashboard" },
        { path: "/admin/users", icon: <FiUsers />, label: "Users" },
        { path: "/admin/recipes", icon: <FiFileText />, label: "Recipes" },
        { path: "/admin/categories", icon: <FiGrid />, label: "Categories" },
        { path: "/admin/comments", icon: <FiMessageSquare />, label: "Comments" },
        { path: "/admin/reports", icon: <FiAlertTriangle />, label: "Reports" },
        { path: "/admin/analytics", icon: <FiPieChart />, label: "Analytics" },
        { path: "/admin/settings", icon: <FiSettings />, label: "Settings" }
    ];

    const activeClassName = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive
                ? "bg-primary text-white font-bold shadow-md"
                : "text-text/70 hover:bg-code-bg hover:text-primary font-semibold"
        }`;

    return (
        <div className="flex h-screen bg-bg overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border/50 flex flex-col h-full shadow-lg z-20">
                <div className="p-6 border-b border-border/50">
                    <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight flex items-center gap-2">
                        <span>🛡️</span> Admin Panel
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
                    {navItems.map((item) => (
                        <NavLink key={item.path} to={item.path} className={activeClassName} end>
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-border/50 space-y-2">
                    <button
                        onClick={() => navigate("/")}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-text/70 hover:bg-code-bg hover:text-text font-semibold transition-colors"
                    >
                        <FiHome />
                        <span>Back to Site</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-red-50 font-bold transition-colors"
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-bg relative">
                {/* Topbar */}
                <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-8 z-10 shadow-sm">
                    <h1 className="text-lg font-bold text-text-h m-0">Platform Administration</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-text/70">
                            Logged in as <span className="text-primary font-bold">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
