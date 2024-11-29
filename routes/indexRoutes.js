// import section 
    import express from "express";
    import userRouter from "./userRoutes.js";

// create router object 
    const mainRoute = express.Router();

// setup the all routes
    mainRoute.use('/api', userRouter);

// export section 
    export default mainRoute;