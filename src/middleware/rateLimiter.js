import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try{
        // ip address and other here just make it simple
        const { success }  = await ratelimit.limit('my-rate-limit');

        if (!success) {
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }

        next();
    }
    catch (error) {
        console.error("Rate limiter error:", error);
        next(error);
        // return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default rateLimiter;