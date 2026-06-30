import { useState, useEffect } from "react";
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import api from "../../utils/api";
import Spinner from "../../components/ui/Spinner";

export default function AdminReports() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusUpdating, setStatusUpdating] = useState(null);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/admin/reports?page=${page}&limit=10`);
            if (response.data?.success) {
                setReports(response.data.data);
                setTotalPages(response.data.pages);
            }
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [page]);

    const handleUpdateStatus = async (reportId, newStatus) => {
        setStatusUpdating(reportId);
        try {
            const res = await api.put(`/admin/reports/${reportId}`, { status: newStatus });
            if (res.data?.success) {
                setReports(reports.map(r => r._id === reportId ? { ...r, status: newStatus } : r));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update report");
        } finally {
            setStatusUpdating(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "resolved":
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500"><FiCheckCircle /> Resolved</span>;
            case "dismissed":
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-text/10 text-text/60"><FiXCircle /> Dismissed</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500"><FiAlertTriangle /> Pending</span>;
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-text-h font-heading">Reports Queue</h2>
                <p className="text-text/60">Review user-submitted reports for moderation.</p>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-code-bg/50 border-b border-border">
                                <th className="p-4 font-bold text-text-h text-sm">Report Details</th>
                                <th className="p-4 font-bold text-text-h text-sm">Target</th>
                                <th className="p-4 font-bold text-text-h text-sm">Status</th>
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
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-text/50 italic">
                                        No reports found. The queue is empty!
                                    </td>
                                </tr>
                            ) : (
                                reports.map(report => (
                                    <tr key={report._id} className="hover:bg-code-bg/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-danger mb-1">{report.reason}</div>
                                            <div className="text-sm text-text/70 mb-2">{report.details || "No additional details provided."}</div>
                                            <div className="text-xs font-semibold text-text/50">Reported by: {report.reporter?.name || "Unknown"}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-code-bg border border-border uppercase tracking-wide text-text/70">
                                                {report.targetType}
                                            </span>
                                            <div className="text-xs text-text/40 mt-1 font-mono">{report.targetId}</div>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(report.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            {report.status === "pending" && (
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        disabled={statusUpdating === report._id}
                                                        onClick={() => handleUpdateStatus(report._id, "resolved")}
                                                        className="px-3 py-1.5 text-xs font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                                    >
                                                        Resolve
                                                    </button>
                                                    <button 
                                                        disabled={statusUpdating === report._id}
                                                        onClick={() => handleUpdateStatus(report._id, "dismissed")}
                                                        className="px-3 py-1.5 text-xs font-bold bg-code-bg border border-border text-text hover:bg-border transition-colors disabled:opacity-50"
                                                    >
                                                        Dismiss
                                                    </button>
                                                </div>
                                            )}
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
