import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiCheck, FiCircle } from "react-icons/fi";
import api, { getAccessToken } from "../../utils/api";
import { useSocket } from "../../context/SocketContext";

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasAuthError, setHasAuthError] = useState(false);
    const dropdownRef = useRef(null);
    const { liveNotifications, markLiveAsRead } = useSocket();

    const fetchNotifications = async () => {
        // Skip if no access token yet (auth still initializing)
        if (hasAuthError || !getAccessToken()) return;
        try {
            const response = await api.get("/notifications");
            if (response.data && response.data.success) {
                // Merge API notifications with any live unread ones, ensuring uniqueness
                const apiNotifs = response.data.data;
                const merged = [...liveNotifications, ...apiNotifs].reduce((acc, current) => {
                    const x = acc.find(item => item._id === current._id);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
                
                setNotifications(merged);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setHasAuthError(true);
            } else {
                console.error("Error fetching notifications:", error);
            }
        }
    };

    useEffect(() => {
        if (hasAuthError) return;
        fetchNotifications();
    }, [hasAuthError, liveNotifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/read/${id}`);
            setNotifications(prev => 
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            markLiveAsRead(); // Optionally, you could be more specific, but this works for demo
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            markLiveAsRead();
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full text-text-h hover:bg-code-bg/50 transition-colors"
                aria-label="Notifications"
            >
                <FiBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-bg"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl overflow-hidden z-50 border border-border/50 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center p-4 border-b border-border bg-card">
                        <h3 className="font-bold text-text-h m-0">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-text/50 italic text-sm">
                                You have no notifications.
                            </div>
                        ) : (
                            <ul className="flex flex-col">
                                {notifications.map(notification => (
                                    <li 
                                        key={notification._id} 
                                        className={`flex gap-3 p-4 border-b border-border/30 hover:bg-code-bg/30 transition-colors ${!notification.isRead ? "bg-primary/5" : "bg-card"}`}
                                    >
                                        <div className="mt-1">
                                            {!notification.isRead ? (
                                                <FiCircle className="text-primary fill-primary" size={10} />
                                            ) : (
                                                <FiCheck className="text-text/30" size={12} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-text-h m-0">
                                                {notification.message}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-text/50">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </span>
                                                {!notification.isRead && (
                                                    <button 
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        className="text-xs text-text/50 hover:text-primary"
                                                    >
                                                        Mark read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
