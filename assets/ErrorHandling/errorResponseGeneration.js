// import section 


class ErrorResponseGenerate {

        static generateErrorForDevelopmentEnvironment = (res, error) => {
              // generate response object dynamically
                    // this is DEVELOPMENT environment 
                    // so here we can send full detailed information about error
                    res.status(error.statusCode).json({
                        status: error.statusCode,
                        message: error.message,
                        stackTrace: error.stack,
                        error: error
                    });
        }

        static generateErrorForTestEnvironment = (res, error) => {
              // generate response object dynamically
                    // this is TEST environment 
                    // so here we can send full detailed information about error
                    res.status(error.statusCode).json({
                        status: error.statusCode,
                        message: error.message,
                        stackTrace: error.stackTrace,
                        error: error
                    });
        }

        static generateErrorForProductionEnvironment = (res, error) => {
             // this is Production Environment 
                // so here we can't send detailed information about the Error
                // send less information 

                // here send to the error to user only isOperational Errors 
                  
                if (error.isOperational) {
                    res.status(error.statusCode).json({
                        status: error.statusCode,
                        message: error.message
                    });
                } else {
                    console.log(error);
                    error.statusCode = 500;
                    error.message = 'Something went wrong!';
                    res.status(error.statusCode).json({
                        status: error.statusCode,
                        message: error.message
                    });
                }
        }
}

// export section 
  export default ErrorResponseGenerate;