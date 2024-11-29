// import section

// class for Error handling 

    // Operational  error like invalid username, invalid password, all field required, and any other custome error

    // here we are using inheritance concept  
    // in javascript we can achive inheritance using extends keyword.
    // we are creating custome ErrorManagement class from Error class

    // super()
        // th super() method refers to the parent class
        // by calling super() method in the child constructor method 
        // we call the parent's constructor method and 
        // get the acess to parent's properties and methods

    class ErrorManagement extends Error{
            constructor(errorMessage, statusCode){
                // call super()
                    // set the error message to super class message
                        super(errorMessage);

                // create custome error code
                    this.statusCode = statusCode;
                    // here we want ot set the status code as 'fail' 
                    // if the statusCode starts with 400 to 499
                    // if the statusCode starts with 500 to 599 that is an 'error'  

                    // we are using ternary operator to assign a value to the variable based on the condition
                        this. status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

                    // operational error 
                        // error like invalid user, permission error, any custome error
                            this.isOperational = true; 

                    // get error StackTrace 
                        // this is comming from super() class (parent class)
                            Error.captureStackTrace(this, this.constructor);
            }
        }

// export section
    export default ErrorManagement;