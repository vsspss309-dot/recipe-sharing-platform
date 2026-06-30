import { NavLink } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function Sidebar({ items = [], onLogout }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Sidebar Toggle */}
            <button 
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-card border border-border rounded-md shadow-sm text-text-h"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            {isMobileOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-bg/80 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileOpen(false)}
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-card border-r border-border flex flex-col transition-transform duration-300 md:translate-x-0 md:static ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="h-20 flex items-center px-6 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl drop-shadow-sm">🍳</span>
                        <span className="text-xl font-extrabold text-text-h font-heading tracking-tight">RecipeHub</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    {items.map((item, idx) => (
                        <NavLink
                            key={idx}
                            to={item.to}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text/70 hover:bg-code-bg hover:text-text-h"}`
                            }
                        >
                            <span className="text-lg opacity-80">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {onLogout && (
                    <div className="p-4 border-t border-border/50">
                        <button 
                            onClick={onLogout} 
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-danger hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            <FiLogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
