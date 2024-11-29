// import section 
import bcrypt from "bcrypt"; // for password hashing


class passwordFunctions {
    // password hash code 
        static  passHash = async (password)=>{
                const saltValueForHashPassword = await bcrypt.genSalt(12)
                const hashedPassword = await bcrypt.hash(password, saltValueForHashPassword);
                return hashedPassword;
            };
    // compair the password from database and user entered password
        static  passwordCompair = async (password, userExistInDb_Password) => {               
            // compair the password from database and user entered password
                const isMatchPassword = await bcrypt.compare(password, userExistInDb_Password);
                return isMatchPassword;
        }
}


       

        
        
// export section
export default passwordFunctions;