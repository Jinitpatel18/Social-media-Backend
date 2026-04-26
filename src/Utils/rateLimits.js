import rateLimit from "express-rate-limit";

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
})

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many login attempts from this IP, please try again after 10 minutes!!'
    }
})

export { generalLimiter, authLimiter };