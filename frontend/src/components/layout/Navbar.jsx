import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import Button from "../ui/Button";
import NotificationDropdown from "../ui/NotificationDropdown";
import { useAuth } from "../../context/AuthContext";

import api, { setAccessToken } from "../../utils/api";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Use AuthContext as the single source of truth for auth state.
    // isLoading=true means initAuth() is still running (silent refresh in progress).
    // Only render NotificationDropdown after auth is fully resolved.
    const { user, isLoading } = useAuth();
    const isLoggedIn = !!user;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Logout API call failed:", err.message);
        } finally {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            setAccessToken("");
            setIsLoggedIn(false);
            window.location.href = "/login";
        }
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const activeClassName = ({ isActive }) => 
        isActive ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-text/70 hover:text-text-h font-semibold transition-colors pb-1";

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-sm py-3" : "bg-transparent py-5"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">🍳</span>
                    <span className="text-xl font-extrabold text-text-h font-heading tracking-tight">RecipeHub</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-text-h p-2 rounded-md hover:bg-code-bg/50 transition-colors" onClick={toggleMenu} aria-label="Toggle menu">
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink to="/" className={activeClassName} end>
                        Home
                    </NavLink>
                    <NavLink to="/recipes" className={activeClassName}>
                        Global Catalogue
                    </NavLink>
                    
                    <div className="w-px h-6 bg-border mx-2"></div>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <NavLink to="/dashboard" className="text-sm font-bold text-text-h hover:text-primary transition-colors">
                                Dashboard
                            </NavLink>
                            {!isLoading && <NotificationDropdown />}
                            <div className="relative group">
                                <Link to="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <FiUser size={18} />
                                </Link>
                                <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
                                    <Link to="/profile" className="block px-4 py-2 text-sm font-semibold text-text hover:bg-code-bg/50 hover:text-text-h">Profile Settings</Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-semibold text-danger hover:bg-red-50">Logout</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <NavLink to="/login" className="text-sm font-bold text-text-h hover:text-primary transition-colors">
                                Sign In
                            </NavLink>
                            <Button onClick={() => window.location.href = "/register"} variant="primary" size="sm" className="shadow-md hover:shadow-glow">
                                Get Started
                            </Button>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 glass-card border-t border-border p-4 flex flex-col gap-4 md:hidden shadow-xl animate-in slide-in-from-top-2">
                        <NavLink to="/" className="text-lg font-bold text-text-h p-2 hover:bg-code-bg/50 rounded-md" onClick={() => setIsOpen(false)} end>
                            Home
                        </NavLink>
                        <NavLink to="/recipes" className="text-lg font-bold text-text-h p-2 hover:bg-code-bg/50 rounded-md" onClick={() => setIsOpen(false)}>
                            Global Catalogue
                        </NavLink>
                        <div className="w-full h-px bg-border my-2"></div>
                        {isLoggedIn ? (
                            <>
                                <NavLink to="/dashboard" className="text-lg font-bold text-text-h p-2 hover:bg-code-bg/50 rounded-md" onClick={() => setIsOpen(false)}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/profile" className="text-lg font-bold text-text-h p-2 hover:bg-code-bg/50 rounded-md" onClick={() => setIsOpen(false)}>
                                    Profile Settings
                                </NavLink>
                                <button onClick={handleLogout} className="text-lg font-bold text-danger text-left p-2 hover:bg-red-50 rounded-md">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 mt-2">
                                <Button onClick={() => { setIsOpen(false); window.location.href = "/login"; }} variant="outline" className="w-full">Sign In</Button>
                                <Button onClick={() => { setIsOpen(false); window.location.href = "/register"; }} variant="primary" className="w-full">Get Started</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
