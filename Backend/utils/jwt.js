import jwt from "jsonwebtoken";

// Generate Access Token (short lifespan: 15m)
export const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || "default_access_secret_12345",
        { expiresIn: "15m" }
    );
};

// Generate Refresh Token (longer lifespan: 7d)
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET || "default_refresh_secret_67890",
        { expiresIn: "7d" }
    );
};

// Send refresh token cookie and return access token in response body
export const sendTokenCookie = (res, user, statusCode) => {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const cookieOptions = {
        httpOnly: true, // Prevents client-side JS from accessing the cookie (mitigates XSS)
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "lax" // Adjust based on cross-domain requirements
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(statusCode).json({
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
};
