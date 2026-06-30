import { getRedisClient } from "../config/redis.js";

/**
 * Middleware to cache GET requests in Redis
 * @param {Number} duration - Cache duration in seconds
 */
export const cache = (duration = 300) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        const redisClient = getRedisClient();
        
        // Graceful fallback: If Redis is down, proceed to next middleware
        if (!redisClient || !redisClient.isOpen) {
            return next();
        }

        const key = `__express__${req.originalUrl || req.url}`;

        try {
            const cachedResponse = await redisClient.get(key);
            
            if (cachedResponse) {
                return res.status(200).json(JSON.parse(cachedResponse));
            } else {
                // Intercept res.json to cache the response before sending it
                res.originalJson = res.json;
                res.json = (body) => {
                    // Only cache successful responses
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        redisClient.setEx(key, duration, JSON.stringify(body))
                            .catch(err => console.error("Redis SetEx Error:", err));
                    }
                    res.originalJson(body);
                };
                next();
            }
        } catch (error) {
            console.error("Redis Cache Error:", error);
            next();
        }
    };
};

/**
 * Utility to clear specific cache patterns (e.g. when a resource is updated)
 * @param {String} pattern - The key pattern to clear (e.g. '/api/recipes*')
 */
export const clearCache = async (pattern) => {
    const redisClient = getRedisClient();
    if (!redisClient || !redisClient.isOpen) return;

    try {
        const keys = await redisClient.keys(`__express__${pattern}`);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (error) {
        console.error("Redis Clear Cache Error:", error);
    }
};
