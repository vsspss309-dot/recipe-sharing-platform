import Recipe from "../models/Recipe.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import { hasCloudinary } from "../middleware/uploadMiddleware.js";
import { clearCache } from "../middleware/cacheMiddleware.js";
import { getIO } from "../socket/socket.js";
import { sendRealTimeNotification } from "../socket/notification.socket.js";

// Helper function to stream Multer buffer upload to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "recipehub_dishes" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        Readable.from(fileBuffer).pipe(uploadStream);
    });
};

// Helper to get the image URL from an uploaded file
const getImageUrl = async (req) => {
    if (!req.file) return null;

    if (hasCloudinary && req.file.buffer) {
        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);
        return result.secure_url;
    } else if (req.file.filename) {
        // Local storage - return a relative URL path
        return `/uploads/${req.file.filename}`;
    }

    return null;
};

// @desc    Get all recipes with searching, filtering, pagination
// @route   GET /api/recipes
// @access  Public
export const getRecipes = async (req, res) => {
    const { search, category, author, favoritedBy, searchBy, sortBy, difficulty, cuisine, time, page = 1, limit = 6 } = req.query;

    try {
        const query = {};

        // Filter by category
        if (category && category !== "All") {
            query.category = category;
        }

        // Filter by author
        if (author) {
            query.author = author;
        }

        // Search by keyword
        if (search) {
            if (searchBy === "title") {
                query.title = { $regex: search, $options: "i" };
            } else if (searchBy === "ingredients") {
                query.ingredients = { $regex: search, $options: "i" };
            } else {
                query.$text = { $search: search };
            }
        }

        // New filters for Day 4
        if (difficulty && difficulty !== "All") {
            query.difficulty = difficulty;
        }

        if (cuisine && cuisine !== "All") {
            query.cuisine = cuisine;
        }

        if (time) {
            // e.g., time="30" meaning <= 30 mins
            const maxTime = parseInt(time);
            if (!isNaN(maxTime)) {
                query.cookingTime = { $lte: maxTime };
            }
        }

        // Filter by favoritedBy (needs to look up the user first)
        if (favoritedBy) {
            const User = (await import("../models/User.js")).default;
            const favoritedUser = await User.findById(favoritedBy);
            if (favoritedUser) {
                query._id = { $in: favoritedUser.favorites };
            } else {
                query._id = { $in: [] }; // Return empty if user not found
            }
        }

        // Sorting logic
        let sortObj = { createdAt: -1 }; // default: newest
        if (sortBy === "popular") {
            sortObj = { viewsCount: -1 };
        } else if (sortBy === "highest_rated") {
            sortObj = { ratingsAverage: -1 };
        } else if (sortBy === "most_saved") {
            sortObj = { savesCount: -1 };
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Fetch counts and paginated list
        const total = await Recipe.countDocuments(query);
        const recipes = await Recipe.find(query)
            .populate("author", "name email avatar")
            .sort(sortObj)
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            recipes
        });
    } catch (error) {
        console.error("Get recipes error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recipes. Server error."
        });
    }
};

// @desc    Get recipes from followed users
// @route   GET /api/recipes/feed
// @access  Private
export const getFeedRecipes = async (req, res) => {
    try {
        const user = req.user;
        
        // Find recipes authored by users in the current user's following array
        const recipes = await Recipe.find({ author: { $in: user.following } })
            .populate("author", "name email avatar")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            recipes
        });
    } catch (error) {
        console.error("Get feed recipes error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch feed recipes. Server error."
        });
    }
};

// @desc    Get trending recipes
// @route   GET /api/recipes/trending
// @access  Public
export const getTrendingRecipes = async (req, res) => {
    try {
        // Trending based on views and likes
        const recipes = await Recipe.find()
            .populate("author", "name email avatar")
            .sort({ viewsCount: -1, likesCount: -1 })
            .limit(5);

        res.status(200).json({ success: true, recipes });
    } catch (error) {
        console.error("Get trending recipes error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get latest recipes
// @route   GET /api/recipes/latest
// @access  Public
export const getLatestRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate("author", "name email avatar")
            .sort({ createdAt: -1 })
            .limit(8);

        res.status(200).json({ success: true, recipes });
    } catch (error) {
        console.error("Get latest recipes error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get single recipe details by ID
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findByIdAndUpdate(
            id,
            { $inc: { viewsCount: 1 } },
            { new: true }
        ).populate("author", "name email avatar");

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }

        res.status(200).json({
            success: true,
            recipe
        });
    } catch (error) {
        console.error("Get recipe details error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to load recipe details. Server error."
        });
    }
};

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private (protect)
export const createRecipe = async (req, res) => {
    const { title, description, cookingTime, difficulty, cuisine, category, ingredients, instructions, image: emojiImage } = req.body;

    try {
        // Get image URL (Cloudinary or local)
        const uploadedImageUrl = await getImageUrl(req);
        
        // Use uploaded image URL, or fallback to emoji from body, or default
        const imageUrl = uploadedImageUrl || emojiImage || "🍲";

        // Process arrays if received as JSON string or string fields
        let ingredientsArray = Array.isArray(ingredients) 
            ? ingredients 
            : typeof ingredients === "string" ? JSON.parse(ingredients) : [];
            
        let instructionsArray = Array.isArray(instructions) 
            ? instructions 
            : typeof instructions === "string" ? JSON.parse(instructions) : [];

        // Simulate 3rd party Nutritional Analysis API call
        // In production, you would map over ingredientsArray and hit Edamam/Spoonacular
        const mockNutritionalInfo = {
            calories: ingredientsArray.length * 120, // dummy estimate
            protein: ingredientsArray.length * 5,
            carbs: ingredientsArray.length * 15,
            fat: ingredientsArray.length * 4
        };

        const recipe = await Recipe.create({
            title,
            description,
            image: imageUrl,
            cookingTime: Number(cookingTime),
            difficulty,
            cuisine,
            category,
            ingredients: ingredientsArray,
            instructions: instructionsArray,
            nutritionalInfo: mockNutritionalInfo,
            author: req.user._id // Linked author ID from protect auth middleware
        });

        // Clear recipes cache
        await clearCache("/api/recipes*");

        res.status(201).json({
            success: true,
            recipe
        });
    } catch (error) {
        console.error("Create recipe error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to publish recipe. Server error."
        });
    }
};

// @desc    Update an existing recipe
// @route   PUT /api/recipes/:id
// @access  Private (protect)
export const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, description, cookingTime, difficulty, cuisine, category, ingredients, instructions, image: emojiImage } = req.body;

    try {
        let recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }

        // Check if current user is authorized to edit (is the original author)
        if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized. You cannot modify other chefs' recipes."
            });
        }

        // Get new image URL if file uploaded, otherwise keep existing
        const uploadedImageUrl = await getImageUrl(req);
        const imageUrl = uploadedImageUrl || emojiImage || recipe.image;

        // Process arrays
        let ingredientsArray = ingredients
            ? (Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients))
            : recipe.ingredients;
            
        let instructionsArray = instructions
            ? (Array.isArray(instructions) ? instructions : JSON.parse(instructions))
            : recipe.instructions;

        recipe.title = title || recipe.title;
        recipe.description = description || recipe.description;
        recipe.cookingTime = cookingTime ? Number(cookingTime) : recipe.cookingTime;
        recipe.difficulty = difficulty || recipe.difficulty;
        recipe.cuisine = cuisine || recipe.cuisine;
        recipe.category = category || recipe.category;
        recipe.ingredients = ingredients ? (typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients) : recipe.ingredients;
        recipe.instructions = instructionsArray;
        recipe.image = imageUrl;

        await recipe.save();

        // Clear recipes cache
        await clearCache("/api/recipes*");

        res.status(200).json({
            success: true,
            recipe
        });
    } catch (error) {
        console.error("Update recipe error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to save recipe edits. Server error."
        });
    }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private (protect)
export const deleteRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }

        // Authorization check
        if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized. You cannot delete other chefs' recipes."
            });
        }

        await recipe.deleteOne();

        // Clear recipes cache
        await clearCache("/api/recipes*");

        res.status(200).json({
            success: true,
            message: "Recipe successfully removed"
        });
    } catch (error) {
        console.error("Delete recipe error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to remove recipe. Server error."
        });
    }
};

// @desc    Toggle save/favorite a recipe
// @route   POST /api/recipes/:id/save
// @access  Private (protect)
export const toggleSaveRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        const user = req.user;
        const isSaved = user.favorites.includes(id);

        if (isSaved) {
            // Unsave
            user.favorites = user.favorites.filter(favId => favId.toString() !== id.toString());
            recipe.savesCount = Math.max(0, (recipe.savesCount || 0) - 1);
        } else {
            // Save
            user.favorites.push(id);
            recipe.savesCount = (recipe.savesCount || 0) + 1;
        }

        await user.save();
        await recipe.save();

        res.status(200).json({
            success: true,
            isSaved: !isSaved,
            savesCount: recipe.savesCount
        });
    } catch (error) {
        console.error("Toggle save recipe error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Toggle like a recipe
// @route   POST /api/recipes/:id/like
// @access  Private (protect)
export const toggleLikeRecipe = async (req, res) => {
    const { id } = req.params;

    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        const user = req.user;
        const isLiked = user.likedRecipes.includes(id);

        if (isLiked) {
            // Unlike
            user.likedRecipes = user.likedRecipes.filter(likedId => likedId.toString() !== id.toString());
            recipe.likesCount = Math.max(0, (recipe.likesCount || 0) - 1);
        } else {
            // Like
            user.likedRecipes.push(id);
            recipe.likesCount = (recipe.likesCount || 0) + 1;
            
            // Trigger Notification
            if (recipe.author.toString() !== user._id.toString()) {
                const Notification = (await import("../models/Notification.js")).default;
                const notification = await Notification.create({
                    recipient: recipe.author,
                    sender: user._id,
                    type: "like",
                    message: `${user.name} liked your recipe: ${recipe.title}`,
                    relatedRecipe: recipe._id
                });
                
                // Emit over Socket.io
                sendRealTimeNotification(getIO(), recipe.author.toString(), notification);
            }
        }

        await user.save();
        await recipe.save();

        res.status(200).json({
            success: true,
            isLiked: !isLiked,
            likesCount: recipe.likesCount
        });
    } catch (error) {
        console.error("Toggle like recipe error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
