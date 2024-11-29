// import section 

    import mongoose from 'mongoose';

// connect db function 
const connectDb = async (DATABASE_URL) => {
    try {
        // create db variable and set some db option
        const DB_OPTIONS = {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            dbName: process.env.DATABASE_NAME
        }
        // connect db 
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log('db connection Done.');
    } catch (error) {
        console.log(error);
    }
}
// export section 
    export default connectDb;