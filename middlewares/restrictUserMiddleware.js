// import section 

// class for restrict user from specific resources

    class RestrictToMiddleware {
        static restrictTo = (...roles) => {
            return (req, res, next) => {
                // roles is an array ['','',''];    
                console.log('req.user.role', req.user.userRole);
                            
                if (!roles.includes(req.user.userRole)) {
                    return res.status(403).json({
                        status: 'fail',
                        message: 'You do not have the permission to access this Assets!'
                    })
                }
                next();
            }
        } 
    }


// export section 
    export default RestrictToMiddleware;