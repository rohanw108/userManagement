// impoer section
    import express from 'express';
    import UserController from '../controllers/userController.js';

    
//----------------------- import midlewares ---------------------------

        // middleware for authentication user
        import userAuthMiddleware from '../middlewares/authMiddleware.js';

        // middleware for restrict user
            import RestrictToMiddleware from '../middlewares/restrictUserMiddleware.js';

//----------------------- end import midlewares ---------------------------

// create router object for user 
      const userRouter = express.Router();

// routes section

    // public routes 

        userRouter.post('/UserLogIn', UserController.userLogin);
        userRouter.post('/userRegistration', UserController.createUser);




// private routes

    // ADMIN Routes
    userRouter.delete('/deleteUser/:userId', userAuthMiddleware, UserController.deleteUser);
    userRouter.put('/updateUserDetailsByAdmin/:userId', userAuthMiddleware, RestrictToMiddleware.restrictTo('ADMIN'), UserController.updateUserDetailsByAdmin);


    // here we can set middleware to route without using the app.use() syntax
    userRouter.get('/getAllUsers', userAuthMiddleware, RestrictToMiddleware.restrictTo('ADMIN'), UserController.getAllUsers);
    userRouter.get('/getUser/:userId', userAuthMiddleware, RestrictToMiddleware.restrictTo('ADMIN'), UserController.getOneUser);


    userRouter.get('/loggedUserDetails', userAuthMiddleware, UserController.loggedUserDetails);

        
    // we can set the middleware using app.use() 
        userRouter.use('/changeUserPassword', userAuthMiddleware);
        userRouter.post('/changeUserPassword', UserController.changeUserPassword);



// export section
export default userRouter;