import helmet from 'helmet';

// manage the NODE_ENV for contentSecurityPolicy: 
    let contentSecurityPolicyLink;

    // manage this acording to NODE_ENV 
    if (process.env.NODE_ENV === 'PRODUCTION') {
        contentSecurityPolicyLink = 'domain name LINK '
    } else if (process.env.NODE_ENV === 'TEST') {
        contentSecurityPolicyLink = 'domain name LINK '
    } else if (process.env.NODE_ENV === 'DEV') {
        contentSecurityPolicyLink = 'domain name LINK '
    } else {
        // this is for LOCAL ENV
        contentSecurityPolicyLink = 'domain name LINK ' 
    };
    
const helmetSecurityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", '- contentSecurityPolicyLink -']
        }
      }, // Default: {} - Sets the Content-Security-Policy header to help prevent XSS attacks
        dnsPrefetchControl: true, // Default: true - Controls browser DNS prefetching
        expectCt: true, // Default: false - Enforces HTTPS by preventing certificate mis-issuance
        frameguard: { 
            action: 'deny' 
        }, // Default: true - Prevents clickjacking attacks
        hidePoweredBy: true, // Default: true - Removes the X-Powered-By header
        hsts: { 
            maxAge: 5184000, 
            includeSubDomains: true 
        }, // Default: true - HTTP Strict Transport Security
        ieNoOpen: true, // Default: true - Sets X-Download-Options for IE8+
        noSniff: true, // Default: true - Sets X-Content-Type-Options to prevent MIME type sniffing
        // permittedCrossDomainPolicies: true, // Default: false - Sets X-Permitted-Cross-Domain-Policies header
        referrerPolicy: { 
                policy: 'strict-origin-when-cross-origin' 
            }, // Default: true - Sets Referrer-Policy header
        xssFilter: true // Default: true - Sets X-XSS-Protection header to help prevent XSS attacks
        // permissionsPolicy: {
        //     features: {
        //       geolocation: ["'self'"],
        //       fullscreen: ["'self'"],
        //       payment: ['example.com'],
        //       syncXhr: ["'none'"]
        //       // Add more features and values as needed
        //     }
        //   }
});

export default helmetSecurityHeaders;