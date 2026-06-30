import Notification from "../models/Notification.js";

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate("sender", "name avatar")
            .populate("relatedRecipe", "title image")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error("Fetch notifications error:", error);
        res.status(500).json({ success: false, message: "Server error fetching notifications" });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/read/:id
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, recipient: req.user._id });
        
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error("Mark notification read error:", error);
        res.status(500).json({ success: false, message: "Server error marking notification" });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error("Mark all notifications error:", error);
        res.status(500).json({ success: false, message: "Server error updating notifications" });
    }
};
