const initialRecipes = [
    {
        id: "1",
        title: "Classic Spaghetti Carbonara",
        description: "A classic Roman pasta recipe made with eggs, hard cheese, cured pork, and black pepper. Simple yet flavorful.",
        image: "🍝",
        prepTime: "25 Mins",
        category: "Italian",
        rating: 4.9,
        author: "Chef Julia",
        ingredients: [
            "200g Spaghetti",
            "100g Guanciale or Pancetta",
            "2 large Eggs",
            "50g Pecorino Romano cheese",
            "Freshly cracked Black Pepper"
        ],
        instructions: [
            "Boil spaghetti in salted water until al dente.",
            "Crisp the guanciale in a pan until golden brown.",
            "Whisk eggs and Pecorino Romano together in a bowl.",
            "Toss pasta in the pan with guanciale, remove from heat, and quickly stir in the egg mixture to create a creamy sauce.",
            "Serve hot with extra black pepper and grated cheese."
        ]
    },
    {
        id: "2",
        title: "Avocado Sourdough Toast",
        description: "Creamy mashed avocado seasoned to perfection on top of a crispy, toasted slice of artisanal sourdough bread.",
        image: "🥑",
        prepTime: "10 Mins",
        category: "Breakfast",
        rating: 4.7,
        author: "Chef Julia",
        ingredients: [
            "1 ripe Avocado",
            "2 slices Sourdough Bread",
            "1 tbsp Olive Oil",
            "Red Pepper Flakes",
            "Salt and Black Pepper"
        ],
        instructions: [
            "Toast the sourdough bread slices until golden brown.",
            "Mash the avocado in a bowl with olive oil, salt, and black pepper.",
            "Spread the mashed avocado evenly over the toasted bread.",
            "Sprinkle red pepper flakes on top and serve immediately."
        ]
    },
    {
        id: "3",
        title: "Chocolate Lava Cake",
        description: "Decadent chocolate cake with a warm, gooey liquid chocolate center. Perfect for dessert lovers.",
        image: "🧁",
        prepTime: "20 Mins",
        category: "Dessert",
        rating: 5.0,
        author: "Chef Marco",
        ingredients: [
            "100g Dark Chocolate",
            "100g Butter",
            "2 Eggs",
            "50g Sugar",
            "50g Flour"
        ],
        instructions: [
            "Preheat oven to 200°C (400°F) and grease ramekins.",
            "Melt the dark chocolate and butter together until smooth.",
            "Whisk eggs and sugar until light and fluffy, then fold in melted chocolate.",
            "Gently stir in the flour until just combined.",
            "Pour into ramekins and bake for 10-12 minutes until edges are firm but center is soft."
        ]
    }
];

const DB_KEY = "recipehub_recipes";

const initializeDB = () => {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(initialRecipes));
    }
};

// Initialize immediately upon loading
initializeDB();

export const db = {
    getRecipes: () => {
        initializeDB();
        try {
            return JSON.parse(localStorage.getItem(DB_KEY)) || [];
        } catch (e) {
            return [];
        }
    },

    getRecipeById: (id) => {
        const recipes = db.getRecipes();
        return recipes.find(r => r.id === id);
    },

    addRecipe: (recipe) => {
        const recipes = db.getRecipes();
        const newRecipe = {
            ...recipe,
            id: Date.now().toString(),
            rating: 5.0, // Default rating for new recipes
            author: "Chef Guest" // Simulated current user
        };
        recipes.push(newRecipe);
        localStorage.setItem(DB_KEY, JSON.stringify(recipes));
        return newRecipe;
    },

    updateRecipe: (id, updatedRecipe) => {
        const recipes = db.getRecipes();
        const index = recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            recipes[index] = { ...recipes[index], ...updatedRecipe };
            localStorage.setItem(DB_KEY, JSON.stringify(recipes));
            return recipes[index];
        }
        return null;
    },

    deleteRecipe: (id) => {
        let recipes = db.getRecipes();
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem(DB_KEY, JSON.stringify(recipes));
        return true;
    },

    clearRecipes: () => {
        localStorage.setItem(DB_KEY, JSON.stringify([]));
        return [];
    },

    resetDB: () => {
        localStorage.setItem(DB_KEY, JSON.stringify(initialRecipes));
        return initialRecipes;
    }
};
