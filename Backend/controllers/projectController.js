import Project from "../models/Project.js";

// @desc    Get all projects (with optional filters)
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("createdBy", "name email");
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch projects", error: error.message });
    }
};

// @desc    Get high impact projects
// @route   GET /api/projects/high-impact
// @access  Private
export const getHighImpactProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isHighImpact: true })
            .sort({ impactScore: -1 })
            .populate("createdBy", "name email");
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch high impact projects", error: error.message });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
    try {
        const { title, description, status, isHighImpact, impactScore } = req.body;
        
        const newProject = await Project.create({
            title,
            description,
            status,
            isHighImpact,
            impactScore,
            createdBy: req.user._id // Assumes authMiddleware attaches user to req
        });

        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create project", error: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update project", error: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete project", error: error.message });
    }
};
