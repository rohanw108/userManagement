// import section 
import { rateLimit } from 'express-rate-limit'

// rate limiter properties

    const rateLimitOptions = rateLimit(
            {
            windowMs: 15 * 60 * 1000, // 15 minutes you can set as many as y
            limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).        
            message: {
                status: 'fail',
                message: 'Too many requests, please try again later!'
            }

            // these are the some other important properties 

                // windowMs: 15 * 60 * 1000, // Default: 60000 (1 minute) - Defines the time window for rate limiting
                // max: 100, // Default: 100 - limit each IP to 100 requests per windowMs - Maximum number of requests allowed per IP within the windowMs
                // message: "Too many requests, please try again later.", // Default: "Too many requests, please try again later." - Error message sent when rate limit is exceeded
                // statusCode: 429, // Default: 429 - HTTP status code for rate limit exceeded (429 - Too Many Requests)
                // headers: true, // Default: true - Enable sending default rate limit headers in the response
                // skipFailedRequests: false, // Default: false - Do not skip counting failed requests (HTTP status >= 400) in rate limiting
                // skipSuccessfulRequests: false, // Default: false - Do not skip counting successful requests (HTTP status < 400) in rate limiting
                // keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip, // Default: (req) => req.headers['x-forwarded-for'] || req.ip - Function to generate the key for rate limiting (uses x-forwarded-for header or req.ip as default)
                // handler: (req, res, next) => { // Custom handler function for rate limit exceeded errors
                //   res.status(429).json({
                //     success: false,
                //     message: "Rate limit exceeded. Please try again later."
                //   });
                // },
                // store: new YourCustomStore() // Example: rate-limit-mongo or rate-limit-redis - Custom store for persisting rate limit counters
            
            }
        );

// export section
    export default rateLimitOptions;