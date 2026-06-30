import Report from "../../models/Report.js";
import Activity from "../../models/Activity.js";

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const reports = await Report.find({})
            .populate("reporter", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Report.countDocuments();

        res.status(200).json({
            success: true,
            data: reports,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching reports" });
    }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
export const updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "resolved", "dismissed"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        report.status = status;
        await report.save();

        await Activity.create({
            user: req.user._id,
            action: `Marked report as ${status}`,
            entityType: "report",
            entityId: report._id
        });

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error updating report" });
    }
};
