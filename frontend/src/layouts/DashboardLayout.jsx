import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { FiLayout, FiUser, FiShield, FiTrendingUp, FiBookmark, FiUsers, FiSettings } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.href = "/login";
    };

    const sidebarItems = [
        { label: "Overview", to: "/dashboard", icon: <FiLayout /> },
        { label: "Saved Recipes", to: "/saved", icon: <FiBookmark /> },
        { label: "Community Feed", to: "/feed", icon: <FiUsers /> },
        { label: "High Impact", to: "/projects/high-impact", icon: <FiTrendingUp /> },
        { label: "My Profile", to: "/profile", icon: <FiUser /> },
        { label: "Settings", to: "/settings", icon: <FiSettings /> }
    ];

    if (user.role === "admin") {
        sidebarItems.push({ label: "Admin Panel", to: "/admin/dashboard", icon: <FiShield /> });
    }

    const getTitle = () => {
        if (location.pathname === "/profile") return "Account Settings";
        if (location.pathname === "/projects/high-impact") return "High Impact Projects";
        if (location.pathname === "/admin") return "Admin Dashboard";
        return "Dashboard Overview";
    };

    return (
        <div className="flex h-screen bg-bg overflow-hidden w-full">
            {/* Sidebar component wrapper */}
            <Sidebar items={sidebarItems} onLogout={handleLogout} />

            {/* Main content viewport */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Topbar title={getTitle()} user={user} />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}