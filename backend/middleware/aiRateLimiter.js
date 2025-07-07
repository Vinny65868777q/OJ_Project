const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
require('dotenv').config(); 

const redisClient = new Redis(process.env.REDIS_URL);

const aiRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,   // 1 day
  max: 3,                          //After 2 calls, further requests will be blocked until the next day.
 
  keyGenerator: req => req.user?.id || req.ip, // one bucket per user
  standardHeaders: true,                        // RateLimit-* headers
   handler: (req, res) => {
    res.status(429).json({
      ok: false,
      error: 'Daily free AI quota reached. Try again tomorrow.',
      retryAfter: req.rateLimit?.resetTime,
      remaining: 0
    });
}
});

module.exports = aiRateLimiter;