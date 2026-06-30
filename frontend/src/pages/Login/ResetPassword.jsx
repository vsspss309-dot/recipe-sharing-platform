import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLock, FiAlertCircle } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);
        
        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            navigate("/login");
        }, 1500);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full flex flex-col gap-6">
                <div className="text-center flex flex-col items-center gap-2">
                    <span className="text-5xl select-none">🔑</span>
                    <h2 className="text-3xl font-extrabold text-text-h font-heading m-0">Set New Password</h2>
                    <p className="text-sm text-text/60 m-0">Please enter your new password below</p>
                </div>

                <div className="border border-border rounded-card p-8 bg-card shadow-md text-left flex flex-col gap-5">
                    {errorMsg && (
                        <div className="flex items-start gap-2 p-3 rounded-button bg-red-50 border border-red-200 text-danger text-sm font-medium">
                            <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                            required
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(""); }}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full font-semibold mt-2"
                            disabled={isSubmitting || !password || !confirmPassword}
                        >
                            {isSubmitting ? "Saving..." : "Reset Password"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
