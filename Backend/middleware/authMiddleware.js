import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes and verify Access JWT
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header (Bearer <token>)
            token = req.headers.authorization.split(" ")[1];

            // Verify Access Token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "default_access_secret_12345"
            );

            // Fetch user and assign context (exclude password)
            req.user = await User.findById(decoded.id);
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User account no longer exists."
                });
            }

            next();
        } catch (error) {
            console.error("JWT verification error:", error.message);
            
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Access token expired. Please refresh your session.",
                    code: "TOKEN_EXPIRED"
                });
            }

            return res.status(401).json({
                success: false,
                message: "Authentication failed. Invalid token."
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Authentication token missing."
        });
    }
};

// Middleware to restrict access based on roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access forbidden. Insufficient permissions."
            });
        }
        next();
    };
};

// Middleware to restrict access based on subscription tiers
export const restrictToTier = (...tiers) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required to check subscription tier."
            });
        }
        
        // If user is Admin, bypass
        if (req.user.role === "admin") {
            return next();
        }

        const userTier = req.user.subscriptionTier || "Free";
        
        if (!tiers.includes(userTier)) {
            return res.status(403).json({
                success: false,
                message: `This feature is limited to ${tiers.join(" or ")} users. Please upgrade your subscription.`,
                requiresUpgrade: true
            });
        }
        
        next();
    };
};
