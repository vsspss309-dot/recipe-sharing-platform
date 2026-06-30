import express from "express";
import { createCheckoutSession, createPortalSession, stripeWebhook } from "../controllers/stripeController.js";
import { protect } from "../middleware/authMiddleware.js"; // Correct import

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.post("/create-portal-session", protect, createPortalSession);

// Note: webhook needs raw body, we'll configure that in server.js
router.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
