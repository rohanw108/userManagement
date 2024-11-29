// import section
    import mongoose from "mongoose";    

// mongoose validations 
    // Mobile Number Validation Regex (for international format, e.g., +1234567890 or 123-456-7890)
    const mobileNumberValidationRegex = /^[6-9]\d{9}$/;

// user schema 
    const UserSchema = mongoose.Schema({
        firstName: { 
            type: String,
            minLength: 2,
            required: [true, 'User name is required!'],
            trim: true,
            maxLength: [200, 'Please enter a valid user name. Maximum length is 200. Please check.']
        },
        lastName: {
            type: String,
            minLength: 2,
            required: [true, 'User name is required!'],
            trim: true,
            maxLength: [200, 'Please enter a valid user name. Maximum length is 200. Please check.']
        }, 
        email: {
            type: String,
            unique: true,
            required: [true, 'User email is required!'],
            lowercase: true,
            trim: true,
        },
        userRole: {
            type:  String ,
            required: [true, 'User role is required.'],
            uppercase: true,          
            enum: {
                values:  ['USER', 'ADMIN'],
                message: "User role must be 'USER', 'ADMIN'"                
            },
            default: 'USER'
        },
        phone: {
            type: String,
            required: [true, 'Mobile number is required!'],
            unique: true,
            match: [mobileNumberValidationRegex, 'Please provide valid mobile number!'], 
            maxlength: 10, 
            minlength: 10 
          },
        userPassword: {
            type: String,
            minLength: [8, 'Password is too short!'],
            required: [true, 'Password is must!'],
            trim: true,
            select: false
        }, 
        isActive: {
            type: String,                
            enum: {
                values:  ['Active', 'Inactive'],
                message: 'Default is active.'
            },
            default: 'Active' 
        },
    },
    {
        timestamps: true,
    });


    // mongoose middleware (hooks) for populate the data

    // create model
        const UserModel = mongoose.model('user', UserSchema);

    // export section
        export default UserModel;