/**
 * Handle notification-specific socket events
 */
export const setupNotificationSockets = (io, socket) => {
    // A client can explicitly emit an event (though usually we emit from the server to the client)
    socket.on("markNotificationRead", (notificationId) => {
        // We could handle this over socket, or just let the REST API handle it.
        // For this architecture, REST API is handling the DB write, so we might just log it here.
        console.log(`Socket ${socket.id} marked notification ${notificationId} as read`);
    });
};

/**
 * Emit a real-time notification to a specific user
 * @param {Object} io - Socket.io instance
 * @param {String} userId - Target user's MongoDB ID
 * @param {Object} notification - Notification object to send
 */
export const sendRealTimeNotification = (io, userId, notification) => {
    try {
        if (io) {
            io.to(`user_${userId}`).emit("newNotification", notification);
        }
    } catch (error) {
        console.error("Socket emit error:", error);
    }
};
