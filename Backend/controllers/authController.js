import User from "../models/User.js";
import { sendTokenCookie, generateAccessToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { generateRandomToken, hashToken } from "../utils/generateToken.js";
import { sendEmail, getPasswordResetEmailTemplate } from "../services/email.service.js";

// @desc    Register a new chef/user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are all required." });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ success: false, message: "This email is already registered." });
        }

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: role || "user",
            isVerified: true  // Always verified — no email confirmation needed
        });

        // Return tokens immediately so user is logged in right after registering
        sendTokenCookie(res, user, 201);
    } catch (error) {
        console.error("Register error:", error.message);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages[0] || "Validation failed. Check your inputs."
            });
        }

        res.status(500).json({
            success: false,
            message: "User registration failed. Please try again."
        });
    }
};

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide an email and password" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        sendTokenCookie(res, user, 200);
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ success: false, message: "Login authentication failed. Server error." });
    }
};

// @desc    Log user out / clear refresh cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.status(200).json({
            success: true,
            message: "Successfully logged out"
        });
    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(500).json({
            success: false,
            message: "Logout failed. Server error."
        });
    }
};

// @desc    Get new access token using refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Session expired. Please log in again."
        });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || "default_refresh_secret_67890"
        );

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists."
            });
        }

        const accessToken = generateAccessToken(user._id);

        res.status(200).json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error("Refresh token error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please login again."
        });
    }
};

// @desc    Change User Password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Please provide both old and new passwords." });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
    }

    try {
        const user = await User.findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect old password." });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        console.error("Change password error:", error.message);
        res.status(500).json({ success: false, message: "Server error changing password." });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email." });
        }

        const resetToken = generateRandomToken();
        user.resetPasswordToken = hashToken(resetToken);
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                to: user.email,
                subject: "RecipeHub - Password Reset",
                html: getPasswordResetEmailTemplate(resetUrl)
            });
            res.status(200).json({ success: true, message: "Email sent with reset instructions." });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ success: false, message: "Email could not be sent." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to process request." });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const hashedToken = hashToken(req.params.token);
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
        }

        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password has been successfully reset." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to reset password." });
    }
};
