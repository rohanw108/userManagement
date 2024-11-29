// import  section
    import ErrorManagement from "./customeErrorManagementFunction.js";

// this function for page not found 
    class RouteNotFoundController {
        static pageNotFoundErrorHandling = (req, res, next) => {
            const err = new ErrorManagement(`hey you! can't find ${req.originalUrl} on the server!`, 404);
            //  call the next function and pass the error into the next function
            next(err);
        }
    }

// export section 
    export default RouteNotFoundController;

