import crypto from "crypto";

/**
 * Generate a random token for email verification or password reset
 * @returns {string} Hex encoded token
 */
export const generateRandomToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash a token (for saving in DB to prevent DB leak attacks)
 * @param {string} token 
 * @returns {string} Hashed token
 */
export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};
