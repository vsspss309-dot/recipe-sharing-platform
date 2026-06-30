import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send an email using Nodemailer. Includes a graceful fallback for local development.
 * @param {Object} options - { to, subject, html }
 */
export const sendEmail = async (options) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn(`[Email Service Bypass] Missing SMTP credentials. Would have sent email to ${options.to} with subject: "${options.subject}"`);
            return;
        }

        const mailOptions = {
            from: `"RecipeHub" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent.");
    }
};

/**
 * Generate Verification HTML Template
 */
export const getVerificationEmailTemplate = (verificationUrl) => {
    return `
    <div style="font-family: Arial, sans-serif; max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p style="color: #555;">Welcome to RecipeHub! Please click the button below to verify your email address and activate your account.</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #f97316; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p style="color: #999; font-size: 12px;">If you did not create an account, no further action is required.</p>
    </div>
    `;
};

/**
 * Generate Password Reset HTML Template
 */
export const getPasswordResetEmailTemplate = (resetUrl) => {
    return `
    <div style="font-family: Arial, sans-serif; max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">You are receiving this email because you (or someone else) requested a password reset for your RecipeHub account.</p>
        <p style="color: #555;">Please click the button below to set a new password. This link is valid for 10 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #3b82f6; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
    </div>
    `;
};
