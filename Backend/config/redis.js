import { createClient } from "redis";

let redisClient;

export const initRedis = async () => {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL || "redis://localhost:6379",
            socket: {
                reconnectStrategy: false // Disable auto-reconnect to avoid ECONNREFUSED spam if Redis is offline locally
            }
        });

        redisClient.on("error", (error) => {
            // Suppress the console.error for ECONNREFUSED to keep terminal clean
            if (error.code !== 'ECONNREFUSED') {
                console.error("Redis Client Error", error);
            }
        });

        redisClient.on("connect", () => {
            console.log("✅ Redis Connected");
        });

        await redisClient.connect();
    } catch (error) {
        console.warn("⚠️ Could not connect to Redis. Running without cache.");
        redisClient = null; // graceful fallback
    }
};

export const getRedisClient = () => redisClient;
