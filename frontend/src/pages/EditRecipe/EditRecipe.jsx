import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiChevronLeft, FiFileText, FiCheck } from "react-icons/fi";
import api from "../../utils/api";
import { resolveImageUrl } from "../../utils/imageUtils";
import Container from "../../components/layout/Container";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Toast from "../../components/ui/Toast";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        image: "🍲",
        cookingTime: "",
        difficulty: "Medium",
        cuisine: "Global",
        category: "Italian",
        ingredientsText: "",
        instructionsText: ""
    });

    const [recipeFound, setRecipeFound] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Toast state
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    useEffect(() => {
        const fetchRecipe = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/recipes/${id}`);
                if (response.data && response.data.success) {
                    const recipe = response.data.recipe;
                    setForm({
                        title: recipe.title,
                        description: recipe.description,
                        image: recipe.image,
                        cookingTime: recipe.cookingTime || "",
                        difficulty: recipe.difficulty || "Medium",
                        cuisine: recipe.cuisine || "Global",
                        category: recipe.category,
                        ingredientsText: recipe.ingredients.join("\n"),
                        instructionsText: recipe.instructions.join("\n")
                    });
                    
                    const resolvedImageUrl = resolveImageUrl(recipe.image);
                    if (resolvedImageUrl) {
                        setImagePreview(resolvedImageUrl);
                    }
                    setRecipeFound(true);
                } else {
                    setRecipeFound(false);
                }
            } catch (error) {
                console.error("Failed to load recipe for editing:", error);
                setRecipeFound(false);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const categoryOptions = [
        { label: "Italian", value: "Italian" },
        { label: "Mexican", value: "Mexican" },
        { label: "Thai", value: "Thai" },
        { label: "Japanese", value: "Japanese" },
        { label: "Mediterranean", value: "Mediterranean" },
        { label: "American", value: "American" },
        { label: "Breakfast", value: "Breakfast" },
        { label: "Dessert", value: "Dessert" },
        { label: "Gujarati", value: "Gujarati" },
        { label: "Rajasthani", value: "Rajasthani" },
        { label: "Marathi", value: "Marathi" },
        { label: "South Indian", value: "South Indian" },
        { label: "Other", value: "Other" }
    ];

    const emojiOptions = [
        { label: "🍲 Stew / Soup", value: "🍲" },
        { label: "🍝 Pasta / Spaghetti", value: "🍝" },
        { label: "🥑 Avocado / Veggie", value: "🥑" },
        { label: "🧁 Cupcake / Muffin", value: "🧁" },
        { label: "🍕 Pizza / Flatbread", value: "🍕" },
        { label: "🥗 Salad / Healthy", value: "🥗" },
        { label: "🍰 Cake / Dessert", value: "🍰" },
        { label: "🍔 Burger / Fast Food", value: "🍔" }
    ];

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateForm = () => {
        const tempErrors = {};
        if (!form.title.trim()) tempErrors.title = "Recipe title is required.";
        else if (form.title.trim().length < 3) tempErrors.title = "Title must be at least 3 characters.";

        if (!form.description.trim()) tempErrors.description = "Recipe description is required.";
        if (!form.cookingTime || isNaN(form.cookingTime)) tempErrors.cookingTime = "Cooking time (in minutes) is required.";
        
        if (!form.ingredientsText.trim()) tempErrors.ingredientsText = "Ingredients are required.";
        if (!form.instructionsText.trim()) tempErrors.instructionsText = "Instructions are required.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
        setForm(prev => ({ ...prev, image: "🍲" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        const ingredients = form.ingredientsText
            .split(/[,\n]/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        const instructions = form.instructionsText
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        const formData = new FormData();
        formData.append("title", form.title.trim());
        formData.append("description", form.description.trim());
        formData.append("cookingTime", form.cookingTime);
        formData.append("difficulty", form.difficulty);
        formData.append("cuisine", form.cuisine);
        formData.append("category", form.category);
        formData.append("ingredients", JSON.stringify(ingredients));
        formData.append("instructions", JSON.stringify(instructions));

        if (imageFile) {
            formData.append("image", imageFile);
        } else {
            formData.append("image", form.image);
        }

        try {
            const response = await api.put(`/recipes/${id}`, formData);
            if (response.data && response.data.success) {
                setToastMsg(`Successfully updated "${form.title.trim()}"!`);
                setIsToastOpen(true);
                setTimeout(() => {
                    navigate(`/recipes/${id}`);
                }, 1500);
            }
        } catch (error) {
            console.error("Save recipe edits error:", error);
            const errMsg = error.response?.data?.message || "Failed to save recipe changes.";
            alert(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Container className="py-20 text-center">
                <Spinner size="lg" />
            </Container>
        );
    }

    if (!recipeFound) {
        return (
            <Container className="py-12 max-w-xl text-center">
                <Alert title="Recipe Not Found" variant="warning" className="mb-6">
                    The recipe you are trying to edit does not exist or may have been deleted.
                </Alert>
                <Button variant="outline" size="md" onClick={() => navigate("/recipes")}>
                    <FiChevronLeft size={16} className="inline mr-1" /> Back to Catalogue
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-6 max-w-2xl text-left">
            <div className="mb-6">
                <Link to={`/recipes/${id}`} className="flex items-center gap-1 text-sm font-semibold text-text/60 hover:text-text-h transition-colors">
                    <FiChevronLeft /> Cancel & Back to Recipe
                </Link>
            </div>

            <div className="border border-border rounded-card p-6 sm:p-8 bg-card shadow-xs">
                <header className="mb-6 pb-4 border-b border-border flex items-center gap-3">
                    <span className="p-2.5 bg-primary-light text-primary rounded-medium border border-primary/10 shadow-xs">
                        <FiFileText size={22} />
                    </span>
                    <div>
                        <h1 className="text-2xl font-extrabold text-text-h font-heading m-0 mb-0.5">Edit Recipe</h1>
                        <p className="text-text/60 text-xs m-0">Modify the settings and ingredients of this culinary recipe.</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Title */}
                    <Input
                        label="Recipe Title"
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="e.g. Homemade Margherita Pizza"
                        error={errors.title}
                        required
                    />

                    {/* Split: Category, Difficulty, Cuisine, Emoji Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Select
                            label="Culinary Category"
                            options={categoryOptions}
                            value={form.category}
                            onChange={(e) => handleChange("category", e.target.value)}
                        />
                        <Select
                            label="Difficulty"
                            options={[
                                {label: "Easy", value: "Easy"},
                                {label: "Medium", value: "Medium"},
                                {label: "Hard", value: "Hard"}
                            ]}
                            value={form.difficulty}
                            onChange={(e) => handleChange("difficulty", e.target.value)}
                        />
                        <Select
                            label="Cuisine"
                            options={[
                                {label: "Global", value: "Global"},
                                {label: "Indian", value: "Indian"},
                                {label: "Italian", value: "Italian"},
                                {label: "Mexican", value: "Mexican"},
                                {label: "Thai", value: "Thai"},
                                {label: "Chinese", value: "Chinese"},
                                {label: "American", value: "American"}
                            ]}
                            value={form.cuisine}
                            onChange={(e) => handleChange("cuisine", e.target.value)}
                        />
                        <Select
                            label="Visual Dish Icon"
                            options={emojiOptions}
                            value={form.image}
                            onChange={(e) => handleChange("image", e.target.value)}
                        />
                    </div>

                    {/* Cover Photo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-h">Recipe Cover Photo</label>
                        <div className="flex items-center gap-4 border border-border border-dashed rounded-button p-4 bg-code-bg/10 hover:bg-code-bg/25 transition-all">
                            {imagePreview ? (
                                <div className="relative w-20 h-20 rounded-medium overflow-hidden border border-border shrink-0">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-xs flex items-center justify-center w-5 h-5 cursor-pointer"
                                        style={{ fontSize: "10px" }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="text-3xl shrink-0 select-none">
                                    {form.image}
                                </div>
                            )}
                            <div className="flex-1 flex flex-col gap-1 text-left">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                    id="recipe-image"
                                    className="hidden"
                                />
                                <label 
                                    htmlFor="recipe-image"
                                    className="cursor-pointer inline-flex self-start px-3 py-1.5 bg-card border border-border hover:border-primary rounded-button text-xs font-bold text-text hover:text-primary transition-all shadow-xs"
                                >
                                    Choose Cover Image
                                </label>
                                <span className="text-[10px] text-text/50">Max size 5MB (JPG, PNG, WEBP). Fallback emoji will be used otherwise.</span>
                            </div>
                        </div>
                    </div>

                    {/* Cooking Time */}
                    <Input
                        label="Cooking Time (Minutes)"
                        type="number"
                        value={form.cookingTime}
                        onChange={(e) => handleChange("cookingTime", e.target.value)}
                        placeholder="e.g. 45"
                        error={errors.cookingTime}
                        required
                    />

                    {/* Description */}
                    <Textarea
                        label="Brief Summary Description"
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Provide a quick overview of what makes this dish so delicious..."
                        error={errors.description}
                        maxLength={250}
                        required
                    />

                    {/* Ingredients input */}
                    <Textarea
                        label="Ingredients (One per line or comma-separated)"
                        value={form.ingredientsText}
                        onChange={(e) => handleChange("ingredientsText", e.target.value)}
                        placeholder="e.g.&#10;2 cups Flour&#10;1 tbsp Olive Oil&#10;Fresh Mozzarella"
                        error={errors.ingredientsText}
                        rows={5}
                        required
                    />

                    {/* Preparation Steps input */}
                    <Textarea
                        label="Preparation Instructions (One step per line)"
                        value={form.instructionsText}
                        onChange={(e) => handleChange("instructionsText", e.target.value)}
                        placeholder="e.g.&#10;Preheat the pizza stone in oven at 250°C.&#10;Roll out the dough into a circular shape.&#10;Spread tomato sauce and top with fresh mozzarella."
                        error={errors.instructionsText}
                        rows={6}
                        required
                    />

                    {/* Action button submits */}
                    <div className="border-t border-border pt-6 mt-2 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="md"
                            onClick={() => navigate(`/recipes/${id}`)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            className="font-semibold shadow-xs flex items-center gap-1.5"
                            disabled={isSubmitting}
                        >
                            <FiCheck size={16} /> {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Success toast alert */}
            <Toast
                isOpen={isToastOpen}
                message={toastMsg}
                type="success"
                onClose={() => setIsToastOpen(false)}
            />
        </Container>
    );
}