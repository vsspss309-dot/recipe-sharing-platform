import { useState, useEffect } from "react";
import { FiTrash2, FiEdit2, FiPlus, FiGrid } from "react-icons/fi";
import api from "../../utils/api";
import Spinner from "../../components/ui/Spinner";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        icon: "FiGrid",
        color: "primary",
        description: ""
    });

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/admin/categories");
            if (response.data?.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ name: "", icon: "FiGrid", color: "primary", description: "" });
    };

    const handleEdit = (category) => {
        setIsEditing(true);
        setCurrentId(category._id);
        setFormData({
            name: category.name,
            icon: category.icon || "FiGrid",
            color: category.color || "primary",
            description: category.description || ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return alert("Name is required");

        setIsSubmitting(true);
        try {
            if (isEditing) {
                const res = await api.put(`/admin/categories/${currentId}`, formData);
                if (res.data?.success) {
                    setCategories(categories.map(c => c._id === currentId ? res.data.data : c));
                    resetForm();
                }
            } else {
                const res = await api.post("/admin/categories", formData);
                if (res.data?.success) {
                    setCategories([...categories, res.data.data]);
                    resetForm();
                }
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save category");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category? This might break recipes using it!")) return;
        
        try {
            const res = await api.delete(`/admin/categories/${id}`);
            if (res.data?.success) {
                setCategories(categories.filter(c => c._id !== id));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete category");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-text-h font-heading">Categories Management</h2>
                <p className="text-text/60">Manage the global recipe categories for the platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 sticky top-8">
                        <h3 className="text-xl font-bold text-text-h mb-6 border-b border-border pb-3">
                            {isEditing ? "Edit Category" : "Add New Category"}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-text/80 mb-1">Category Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-code-bg border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                    placeholder="e.g. Breakfast"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text/80 mb-1">Icon Identifier</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    className="w-full bg-code-bg border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                    placeholder="e.g. FiCoffee"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text/80 mb-1">Color Theme</label>
                                <select
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="w-full bg-code-bg border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
                                >
                                    <option value="primary">Primary (Blue)</option>
                                    <option value="secondary">Secondary (Pink)</option>
                                    <option value="success">Success (Green)</option>
                                    <option value="warning">Warning (Yellow)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text/80 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full bg-code-bg border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 py-2 rounded-xl border border-border text-text font-bold hover:bg-code-bg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors ${
                                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {isSubmitting ? <Spinner size="sm" /> : (isEditing ? <FiEdit2 /> : <FiPlus />)}
                                    {isEditing ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-code-bg/50 border-b border-border">
                                        <th className="p-4 font-bold text-text-h text-sm">Category Info</th>
                                        <th className="p-4 font-bold text-text-h text-sm">Color</th>
                                        <th className="p-4 font-bold text-text-h text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="3" className="p-10 text-center">
                                                <Spinner size="md" />
                                            </td>
                                        </tr>
                                    ) : categories.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="p-10 text-center text-text/50 italic">
                                                No categories defined yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map(category => (
                                            <tr key={category._id} className="hover:bg-code-bg/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-${category.color || 'primary'}/10 text-${category.color || 'primary'}`}>
                                                            <FiGrid size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-text-h">{category.name}</div>
                                                            <div className="text-xs text-text/60 line-clamp-1">{category.description || "No description"}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-code-bg border border-border text-text/70">
                                                        {category.color}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button 
                                                        onClick={() => handleEdit(category)}
                                                        className="inline-block p-2 text-text/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Edit Category"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(category._id)}
                                                        className="inline-block p-2 text-text/40 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Category"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
