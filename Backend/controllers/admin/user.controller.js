import User from "../../models/User.js";
import Activity from "../../models/Activity.js";

// @desc    Get all users with pagination and search
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const role = req.query.role;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        if (role && role !== "all") {
            query.role = role;
        }

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: users,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching users" });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "admin" && req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "Cannot delete another admin" });
        }

        await user.deleteOne();

        // Log activity
        await Activity.create({
            user: req.user._id,
            action: `Deleted user ${user.email}`,
            entityType: "user",
            entityId: user._id
        });

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error deleting user" });
    }
};
