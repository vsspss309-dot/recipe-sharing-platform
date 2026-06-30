import User from "../models/User.js";

// @desc    Toggle follow/unfollow a user
// @route   POST /api/users/:id/follow
// @access  Private
export const toggleFollow = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        if (targetUserId === currentUserId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself." });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({
            success: true,
            isFollowing: !isFollowing,
            followersCount: targetUser.followers.length,
            followingCount: targetUser.following.length
        });
    } catch (error) {
        console.error("Toggle follow error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get user profile with follower stats
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("followers", "name avatar")
            .populate("following", "name avatar");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const Notification = (await import("../models/Notification.js")).default;
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate("sender", "name avatar")
            .populate("relatedRecipe", "title image")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ success: false, message: "Server error fetching notifications" });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res) => {
    try {
        const Notification = (await import("../models/Notification.js")).default;
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error marking notification as read" });
    }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { name, bio } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error updating profile" });
    }
};

// @desc    Get user's saved recipes
// @route   GET /api/users/saved
// @access  Private
export const getSavedRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'favorites',
            select: 'title description image cookingTime difficulty category ratingsAverage likesCount savesCount createdAt'
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user.favorites });
    } catch (error) {
        console.error("Get saved recipes error:", error);
        res.status(500).json({ success: false, message: "Server error fetching saved recipes" });
    }
};
