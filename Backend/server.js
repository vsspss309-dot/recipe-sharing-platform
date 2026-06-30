import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import dns from "dns";

dotenv.config();

// Configure DNS fallback for Node.js (c-ares) if it only detects loopback (common Windows bug)
const currentDnsServers = dns.getServers();
if (!currentDnsServers || currentDnsServers.length === 0 || currentDnsServers.every(ip => ip === "127.0.0.1" || ip === "::1")) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

import { initSocket } from "./socket/socket.js";
import { initRedis } from "./config/redis.js";
import http from "http";

// ... existing code ...

const PORT = process.env.PORT || 5000;

// Create HTTP server instead of relying on app.listen directly
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// MongoDB & Redis Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
        
        await initRedis();

        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Database Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

connectDB();