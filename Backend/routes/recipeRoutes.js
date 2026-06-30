import express from "express";
import { 
    getRecipes,
    getFeedRecipes,
    getTrendingRecipes,
    getLatestRecipes,
    getRecipeById, 
    createRecipe, 
    updateRecipe, 
    deleteRecipe,
    toggleSaveRecipe,
    toggleLikeRecipe
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { cache } from "../middleware/cacheMiddleware.js";

const router = express.Router();

router.route("/")
    .get(cache(300), getRecipes)
    .post(protect, upload.single("image"), createRecipe);

router.get("/feed", protect, getFeedRecipes);
router.get("/trending", cache(300), getTrendingRecipes);
router.get("/latest", cache(300), getLatestRecipes);

router.route("/:id")
    .get(getRecipeById)
    .put(protect, upload.single("image"), updateRecipe)
    .delete(protect, deleteRecipe);

router.post("/:id/save", protect, toggleSaveRecipe);
router.post("/:id/like", protect, toggleLikeRecipe);

export default router;
