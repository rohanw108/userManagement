// create middleware for authentication 

    // import section       
        import UserModel from "../models/userModel.js";
        import { verifyUserJWTToken } from "../assets/JWT_TokenManagement/createJWT_Token.js"
        import ErrorManagement from "../assets/ErrorHandling/customeErrorManagementFunction.js";
    
    //  middleware function 
    const userAuthMiddleware = async (req, res, next) => {
        let userToken;
        const { authorization } = req.headers;
        if (authorization && authorization.startsWith('Bearer')) {
            try {
                userToken = authorization.split(' ')[1];

                // get userId from jwt token 
                    const userID = verifyUserJWTToken(userToken, process.env.ACCESS_TOKEN_SECRET);

                // get the userid from token and set that userId into the req object                     
                    const currentUser =  await UserModel.findOne({ _id: userID }, { password: 0 });

                // check if user still exists 
                    if (!currentUser) {

                    // generate the error message from ErrorManagement class              
                        const err = new ErrorManagement('The token is no longer exist!', 401);   

                    // return error
                        return next(err);
                    }
                    
                    // set the user in req
                        req.user = currentUser;
                    
                        next();
            } catch (error) {
                return res.status(401).send({status: 'faild', msg: 'Unauthorized User!'})
            }
        }
        if (!userToken) {
            return res.status(401).send({ status: "faild", msg: 'Unauthorized User! No Token.' });            
        }
    }

    // export section
        export default userAuthMiddleware;
