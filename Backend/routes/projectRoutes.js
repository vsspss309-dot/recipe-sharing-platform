import express from "express";
import {
    getProjects,
    getHighImpactProjects,
    createProject,
    updateProject,
    deleteProject
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all project routes
router.use(protect);

router.route("/")
    .get(getProjects)
    .post(createProject);

router.route("/high-impact")
    .get(getHighImpactProjects);

router.route("/:id")
    .put(updateProject)
    .delete(deleteProject);

export default router;
