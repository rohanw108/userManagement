// import section
    import ErrorManagement from "./customeErrorManagementFunction.js";

// here we are handling the the mondodbServer error, cast error and other 
    class ErrorHandlingFunctions {

        // CastError handling function 
            static castErrorHandler = (error) => {

                // find the exact value for cast error and create an error message
                    const message = `invalid value of ${error.path} : ${error.value[error.path]}.`;

                // create a isOperatonal error and send the error message
                    return new ErrorManagement(message, 400);
            }

        // duplicateKeyErrorHandle
            static duplicateKeyErrorHandle = (error) => {

                    // check the value in error message 
                        let value = error.message.split("index:")[1].split("dup key")[0].split("_")[0];
                    // if the exampleName then convert it into
                    /*
                      if the vale is camleCase (like -> exampleName) then 
                      it will split it into two word (like : example Name)
                      then convert the first letter in caps
                    */ 
                    // change camleCase into normal word
                        let value2 = value.replace(/([a-z])([A-Z])/g, '$1 $2');

                    // first letter in upper case
                        let value3 = value2.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

                    // create custome error message
                        const message = `${value3} already exists, Please provide unique one!`;  
                    
                    // create a isOperatonal error and send the error message
                        return new ErrorManagement(message, 400);
                }

        //  validationErrorHandle(error);
                static  validationErrorHandle = (error) => {

                    // get all error objects into in one single array
                        const errorArray = Object.values(error.errors).map( singleError => singleError.message);
            
                    // join all error messages into one single string
                        const finalErrorMessage = errorArray.join('. ');
            
                    // create create a error message 
                        const finalMessage = `${ finalErrorMessage }.`
            
                    // create a isOperatonal error and send the error message
                        return new ErrorManagement(finalMessage, 400);
                }
    }

// export section
    export default ErrorHandlingFunctions;