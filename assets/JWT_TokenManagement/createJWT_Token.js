// create a jwt token for login 

    // import section 
        import jwt from 'jsonwebtoken'; // for authentication and autherization

    // function for create jwt token 
        const generateJWT_Token = (registeredUserID,secretKey, expiresIn) => {
            // generate jwt token 
            const JWTtoken = jwt.sign(  { 
                                            userID: registeredUserID 
                                        }, 
                                        secretKey, 
                                        {
                                             expiresIn: expiresIn
                                        }
                                    );
            return JWTtoken;
        }

        const generateRefreshToken = (registeredUserID, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY) => {
            // generate Refresh token 
            const refreshtoken = jwt.sign(  { 
                                            userID: registeredUserID 
                                        }, 
                                        REFRESH_TOKEN_SECRET, 
                                        {
                                            expiresIn: REFRESH_TOKEN_EXPIRY
                                        }
                                    );
            return refreshtoken;
        }

    //  verify user JWT token 
        const verifyUserJWTToken = (userToken, secreteKey) => {
            // verify the token and get usetId from token which we have set at the time of login 
                // get the userId from token (using destructuring)   
                const { userID } = jwt.verify(userToken, secreteKey);
                return userID;
        }
    // export section 
        export { generateJWT_Token, generateRefreshToken, verifyUserJWTToken };