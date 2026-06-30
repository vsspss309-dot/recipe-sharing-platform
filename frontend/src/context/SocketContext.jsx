import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();
    
    // We'll store notifications received via socket here temporarily
    // A more robust app might use a global store (Redux/Zustand) or react-query
    const [liveNotifications, setLiveNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            // Connect to the backend socket server
            const socketInstance = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
                withCredentials: true
            });

            setSocket(socketInstance);

            socketInstance.on('connect', () => {
                console.log('Connected to socket server');
                // Join personal room to receive private notifications
                socketInstance.emit('joinUserRoom', user._id || user.id);
            });

            // Listen for new notifications
            socketInstance.on('newNotification', (notification) => {
                console.log("New live notification:", notification);
                setLiveNotifications(prev => [notification, ...prev]);
                
                // You could also trigger a toast/snackbar here
                // toast.success(notification.message);
            });

            return () => {
                socketInstance.disconnect();
            };
        } else if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    }, [user]);

    const markLiveAsRead = () => {
        setLiveNotifications([]);
    };

    return (
        <SocketContext.Provider value={{ socket, liveNotifications, markLiveAsRead }}>
            {children}
        </SocketContext.Provider>
    );
};
