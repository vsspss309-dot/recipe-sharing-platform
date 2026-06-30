import { useState, useEffect } from "react";
import { FiTrash2, FiMessageSquare, FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Spinner from "../../components/ui/Spinner";

export default function AdminComments() {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/admin/comments?page=${page}&limit=20`);
            if (response.data?.success) {
                setComments(response.data.data);
                setTotalPages(response.data.pages);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [page]);

    const handleDelete = async (commentId) => {
        if (!window.confirm("Are you sure you want to permanently delete this comment?")) return;
        
        try {
            const res = await api.delete(`/admin/comments/${commentId}`);
            if (res.data?.success) {
                setComments(comments.filter(c => c._id !== commentId));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete comment");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-text-h font-heading">Comment Moderation</h2>
                <p className="text-text/60">Review and moderate user comments across all recipes.</p>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-code-bg/50 border-b border-border">
                                <th className="p-4 font-bold text-text-h text-sm w-1/2">Comment Content</th>
                                <th className="p-4 font-bold text-text-h text-sm">Author</th>
                                <th className="p-4 font-bold text-text-h text-sm">Date</th>
                                <th className="p-4 font-bold text-text-h text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center">
                                        <Spinner size="md" />
                                    </td>
                                </tr>
                            ) : comments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-text/50 italic">
                                        No comments found.
                                    </td>
                                </tr>
                            ) : (
                                comments.map(comment => (
                                    <tr key={comment._id} className="hover:bg-code-bg/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex gap-3">
                                                <div className="mt-1 text-text/40 shrink-0">
                                                    <FiMessageSquare size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-text font-medium whitespace-pre-wrap mb-2">
                                                        {comment.text}
                                                    </p>
                                                    {comment.recipe && (
                                                        <Link 
                                                            to={`/recipe/${comment.recipe._id}`}
                                                            target="_blank"
                                                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                                        >
                                                            On: {comment.recipe.title} <FiExternalLink />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-text">
                                            {comment.author?.name || "Unknown User"}
                                        </td>
                                        <td className="p-4 text-sm text-text/70">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(comment._id)}
                                                className="p-2 text-text/40 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Comment"
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
                
                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="p-4 border-t border-border flex justify-between items-center bg-code-bg/30">
                        <span className="text-sm text-text/60 font-semibold">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 text-sm font-bold bg-card border border-border rounded-xl hover:border-primary disabled:opacity-50 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="px-4 py-2 text-sm font-bold bg-card border border-border rounded-xl hover:border-primary disabled:opacity-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
