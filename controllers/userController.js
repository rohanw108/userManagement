// import section 
    import UserModel from "../models/userModel.js";
    import ErrorManagement from "../assets/ErrorHandling/customeErrorManagementFunction.js";
    import mongoose from "mongoose";
    import ApiFeatureManagement from "../assets/advanceApiFeature/apiFeaturesManagement.js";
    import { generateJWT_Token, generateRefreshToken, verifyUserJWTToken } from '../assets/JWT_TokenManagement/createJWT_Token.js';
    import passwordFunctions from "../assets/passwordManagement/passwordEncryptDecrypt.js";

// class for user management

    class UserController {
        static createUser = async (req, res, next) => {
            try {
                // get the user details from body 
                    const { firstName, lastName, email, userPassword, userConfirmPassword, phone } = req.body;

                // validation
                if (!firstName || !lastName || !email || !userPassword || !userConfirmPassword || !phone) {
                    const err = new ErrorManagement(`All fields are required.`, 404);            
                    return next(err);
                };

                // check the user is already exists 
                    const getUser = await UserModel.findOne({
                        email: email
                    });

                    if (getUser) {
                        const err = new ErrorManagement(`User name already exists!`, 404);            
                        return next(err);
                    };
                // check the password and confirm password is correct
                    if (userPassword !== userConfirmPassword) {
                        const err = new ErrorManagement(`Password and confirm password must be same!`, 404);            
                        return next(err);
                    };
                //  create user object 
                    const createUser = new UserModel({
                        firstName: firstName,
                        lastName: lastName, 
                        email: email,  
                        userPassword: await passwordFunctions.passHash(userPassword), 
                        phone: phone 
                    });
                // save user in db
                    const user = await createUser.save();
                    if (!user) {
                        const err = new ErrorManagement(`User registration failed!`, 404);            
                        return next(err);
                    };

                    return res.status(201).json({
                        status: 'success',
                        message: 'User created successfully.'
                    });


            } catch (error) {
                return next(error);
            }
        };

        static userLogin = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    const err = new ErrorManagement(`All fields are required!`, 404);            
                    return next(err);
                };
                // check the user is already exists 
                const getUser = await UserModel.findOne({
                    email: email
                },{
                    userPassword: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    phone: 1
                });

                if (!getUser) {
                    const err = new ErrorManagement(`Invalid User!`, 404);            
                    return next(err);
                };

                // check the user is active or not

                 // compair the password
                 const isUserPasswordMatch = await passwordFunctions.passwordCompair(password, getUser.userPassword);
                if (!isUserPasswordMatch) {
                    const err = new ErrorManagement(`Invalid credentials!`, 404);            
                    return next(err);
                };

                // generate access token and refresh token
                const accessToken = generateJWT_Token(getUser._id, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
                const refreshToken = generateRefreshToken(getUser._id, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY);
 
                

                return res.status(200).send(
                    { 
                        status: "success", 
                        message: "You are LogedIn.",
                        getUser,
                        accessToken,
                        refreshToken
                    });
            } catch (error) {
                return next(error);
            }
        }; 


        // user change password 
        static changeUserPassword = async (req, res, next) => {
            // resources for user logs
            let resources = [];
        try {
            const { password, confirmPassword, oldPassword } = req.body;
            if ( password && confirmPassword && oldPassword) {
                
                const getUser = await UserModel.findOne({
                    email: req.user.email
                },
            {
                userPassword: 1
            });

                if (!getUser) {
                    const err = new ErrorManagement(`Invalid User!`, 404);            
                    return next(err);
                };
                // compair the passwords
                const isUserPasswordMatch = await passwordFunctions.passwordCompair(oldPassword, getUser.userPassword);
                if (!isUserPasswordMatch) {
                // generate the error message from ErrorManagement class 
                    const err = new ErrorManagement(`Invalid old password. Please enter the correct password.`, 400);

                // return error
                    return next(err);                    
                };

                // new password is not same as last passowrd 
                const isLastPasswordMatch = await passwordFunctions.passwordCompair(password, getUser.userPassword);
                // console.log('hi', isLastPasswordMatch);
                if (isLastPasswordMatch === true) {
                    // generate the error message from ErrorManagement class 
                    const err = new ErrorManagement(`Invalid password. New password should not be the same as the old password.`, 400);

                // return error
                    return next(err);
                };

                if (password === confirmPassword) {
                    let newPassword = await passwordFunctions.passHash(confirmPassword);
                    
                    // once the password is changed successfully then set the new date for lastPasswordUpdated
                    const passwordUpdatedStatus = await UserModel.findByIdAndUpdate(
                        req.user._id, 
                        { 
                            $set: 
                            { userPassword: newPassword } 
                        },
                        {
                            // new keyword for return a updated (new) document after exicuting the update query
                            // runValidators is an mongoose validation property for apply the validations for update query 
                                new: true,
                                runValidators: true
                        });
                    
                    return res.status(200).send({ 
                        status: 'success', 
                        message: 'Your password has been successfully updated.', 
                        passwordUpdatedStatus });
                } else {
                    
                        // generate the error message from ErrorManagement class 
                            const err = new ErrorManagement(`The password and confirm password must be same.`, 400);

                        // return error
                            return next(err);
                }
            } else {
                // generate the error message from ErrorManagement class 
                    const err = new ErrorManagement(`Both oldPassword, password and confirmation password are required.`, 400);

                // return error
                    return next(err);                
            }
        } catch (error) {
            return next(error);
        }
        }


         // logged user data 
    static loggedUserDetails = async (req, res, next) => {
       try {
           
           return res.status(200).send({ status: "success", loggedUserDetails: req.user });
       } catch (error) {
            
           return next(error);
       }
   }
   static getOneUser = async (req, res, next) => {
       try {
        // how to access req.params    
           const userId = req.params.userId;

        // get user with comming userId
           const getUser = await UserModel.findById({ _id: userId });

        // check the user is available or not 
           if (!getUser) {
               // generate the isOperational error and send it to error class
                   const err = new ErrorManagement('User not found with this ID.', 404);  

               //  return a error if user not found
                   return next(err);
           }
        
        // return success message after getting an user
            return res.status(200).json({
                    status: "success",
                    getUser: getUser
                });
        } catch (error) {
           return next(error);           
       }
       
   }
   // get all users list 
   static getAllUsers = async (req, res, next) => {
       try {          
           // create a api feature object 
                  
               const allUserApiFeature = new ApiFeatureManagement(UserModel.find(), req.query)
                               .filterFeature()
                               .limitingSelectFieldsFeature()
                               .sortFeature()

           // exicute query 
               const allUsers = await allUserApiFeature.DB_Query;

               return res.status(200).json({
                   status: "success",
                   usersCount: allUsers.length,
                   allUsers: allUsers,
               });
           
       } catch (error) {
           
           return next(error);
       }
   }


     // delete User
     static deleteUser = async (req, res, next) => {
       try {
           // get user id from req.params
                const userId = req.params.userId;

           // change the user status 
            let updateUserActiveStatus;
           
           // get the user current status 
               const userCurrentStatus = await UserModel.findById(userId, { isActive: 1, _id: 0 });

           // set the user value acording to updateUserActiveStatus
               updateUserActiveStatus = (userCurrentStatus.isActive === 'Active') ? 'Inactive' : 'Active';
            
           const deleteUser = await UserModel.findByIdAndUpdate(userId, { $set: { isActive: updateUserActiveStatus } });
           // check the deleteUser is deleted or not
           if (!deleteUser) {
               // generate the error message from ErrorManagement class 
                   const err = new ErrorManagement(`User not found.`, 404);

               // return error
                   return next(err);
           };

           // status code 204 is for no content
          return  res.status(200).json({
               status: 'success',
               blackedStatus: updateUserActiveStatus
           });

       } catch (error) {
           return next(error);
       }
   };


   // update the user details by admin 
    static updateUserDetailsByAdmin = async (req, res, next) => {
       
       try {
           // get user id from req.params
               const userId = req.params.userId;

           // get the user role from req.body
               const {  userRole } = req.body;

           // check the userRole is available or not 
               if ( !userRole ) {
                   // generate the error message from ErrorManagement class 
                       const err = new ErrorManagement(`Role is required.`, 404);

                   // return error
                       return next(err);
               };

           
           // check the 
           const user = await UserModel.findById(userId);
               if (!user) {
                   // generate the error message from ErrorManagement class 
                   const err = new ErrorManagement(`User not found.`, 400);

                   // return error
                       return next(err); 
               }
       
                   // update the user 
                       const uodateUser = await UserModel.findByIdAndUpdate({ _id: userId }, 
                        {
                           $set: {  
                               userRole: userRole,
                           }                     
                           },
                           {
                               new: true,
                               runValidators: true
                           });
                    // check the uodateUser is deleted or not
                       if (!uodateUser) {
                           // generate the error message from ErrorManagement class 
                               const err = new ErrorManagement(`User not found.`, 404);

                           // return error
                               return next(err);
                       };
                  
                   // status code 204 is for no content
                       return  res.status(200).json({
                               status: 'success',
                               updateUserDetails: uodateUser,
                               updateUser: 'User details has been successfully updated.'
                       });  
       } catch (error) {
           return next(error);
       }
   }
    };

// export section 
    export default UserController;