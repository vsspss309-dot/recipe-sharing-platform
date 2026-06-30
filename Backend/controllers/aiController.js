import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy_key",
});

// @desc    Generate a recipe based on ingredients
// @route   POST /api/ai/generate-recipe
// @access  Private (Pro/Chef)
export const generateRecipe = async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ success: false, message: "Please provide a list of ingredients." });
    }

    try {
        const prompt = `You are a master chef. Create a delicious recipe using ONLY or MOSTLY these ingredients: ${ingredients.join(", ")}. 
        You can include basic pantry staples (oil, salt, pepper, water) as well.
        
        Respond ONLY with a valid JSON object matching this exact schema, and nothing else (no markdown blocks, no intro text).
        {
            "title": "Creative Name of the Dish",
            "description": "A short, appetizing description of the dish.",
            "prepTime": "e.g., 30 mins",
            "category": "One of: Breakfast, Italian, Dessert, Gujarati, Rajasthani, Marathi, South Indian, Mexican, Thai, Japanese, Mediterranean, American, Other",
            "ingredients": ["1 cup rice", "2 tbsp olive oil", ...],
            "instructions": ["Step 1 description", "Step 2 description", ...]
        }`;

        // Fallback for dummy keys or missing config to not break development
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy_key") {
            // Simulate a delay and return mock data
            await new Promise(resolve => setTimeout(resolve, 2000));
            return res.status(200).json({
                success: true,
                data: {
                    title: "Mock AI Recipe",
                    description: "This is a mocked recipe because OPENAI_API_KEY is not set.",
                    prepTime: "25 mins",
                    category: "Other",
                    ingredients: ingredients.concat(["salt", "pepper"]),
                    instructions: ["Mix ingredients.", "Cook well.", "Serve hot."]
                }
            });
        }

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" }
        });

        const generatedContent = completion.choices[0].message.content;
        const recipeData = JSON.parse(generatedContent);

        res.status(200).json({ success: true, data: recipeData });
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to generate recipe from AI." });
    }
};
