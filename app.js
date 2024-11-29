// import .env and configure 
    import dotenv from 'dotenv';
    dotenv.config();
// --------------------- import section ------------------
    // import core modules
        import  express  from 'express';
        import https from 'https';
        import path from 'path';
        import fs from 'fs';

     // import custome modules  
        import connectDb from './DB/connectDB.js';
        import RouteNotFoundController from './assets/ErrorHandling/pageNotFoundError.js';
        import { ErrorHandlingMiddleware } from './assets/ErrorHandling/errorManagementController.js';
        import projectEnvironmentTypes from './assets/projectConstants/projectEnvironments.js';
    
    // import third-party modules
        import cors from 'cors';
        import helmet from 'helmet';

    // basic variables
        const app = express();
        const PORT = process.env.PORT;
        const DATABASE_URL = process.env.DATABASE_URL;


    // database connection
    connectDb(DATABASE_URL);

    // security HTTP headers section 
        import helmetSecurityHeaders from './assets/appSecurity/securityHeadersWithHelmet.js';
        app.use(helmetSecurityHeaders); 

// express rate limit
    import rateLimitOptions from './assets/appSecurity/expressRateLimiter.js';
    app.use(rateLimitOptions);
    
// return json data and body size limiting
    import bodySizeLimiting from './assets/appSecurity/preventDOSAttackViaBodyLimiting.js';
    app.use(express.json(bodySizeLimiting));


// set middleware fro url encoding (for use req.body )
    app.use(express.urlencoded({ limit: '25mb', extended:false }));

// prevent noSql query injections 
    import mongoSanitize from './assets/appSecurity/preventNoSqlQueryInjectionAndManageDataSanitization.js';
    app.use(mongoSanitize());

// set ejs engine
    // set views or otherfile name
        app.set("views", "./views");
    // set ejs template engine as view engine
        app.set("view engine", "ejs");

// project Routes
    // set the custome routes
    import mainRoute from './routes/indexRoutes.js';
    
    app.use('/userManagement', mainRoute);

    // set the custome routes
    app.use('/public',  express.static( path.join( process.cwd(), 'public')));


// middleware for unhandled routes
    app.all('*',  RouteNotFoundController.pageNotFoundErrorHandling);

// error handling middleware
    app.use(ErrorHandlingMiddleware);

// server setup acording to development environment
    const serverManagement = async () => {
        try {
            // check the development environmnt whether it is 'LOCAL' or 'DEVELOPMENT' or 'TEST' or 'PRODUCTION'
                if (process.env.NODE_ENV === projectEnvironmentTypes.localEnv) {
                    console.log('LOCAL env');
                    // listen the server 
                        app.listen(PORT, ()=> {
                            console.log(`Server listening at PORT ${PORT}`);
                        });
                } else if (process.env.NODE_ENV === projectEnvironmentTypes.developmentEnv) {
                    console.log('DEVELOPMENT env');
                    /*
                        here we are adding SSL certificate for that we have to to configure some more information 
                        like SSL files 
                        key, ca, cert files 
                    */
                    // ssl server setup 
                        let sslOptions = {
                            rejectUnauthorized: false,
                            key: fs.readFileSync(path.join(process.cwd(), 'SSL_PRIVATE_KEY')),
                            ca: fs.readFileSync(path.join(process.cwd(), 'SSL_CA_FILE')),
                            cert: fs.readFileSync(path.join(process.cwd(),'SSL_certificate')),
                        };

                    // create a sslServer variable with https and pass th SSL details in option
                        const sslServer = https.createServer(sslOptions, app);

                    // listen server 
                        sslServer.listen(PORT, () => {
                            console.log(`Server listening at PORT ${PORT}`);
                        });
                } else if (process.env.NODE_ENV === projectEnvironmentTypes.testEnv) {
                    console.log('TEST env');
                    /*
                        here we are adding SSL certificate for that we have to to configure some more information 
                        like SSL files 
                        key, ca, cert files 
                    */
                    // ssl server setup 
                        let sslOptions = {
                            rejectUnauthorized: false,
                            key: fs.readFileSync(path.join(process.cwd(), 'SSL_PRIVATE_KEY')),
                            ca: fs.readFileSync(path.join(process.cwd(), 'SSL_CA_FILE')),
                            cert: fs.readFileSync(path.join(process.cwd(),'SSL_certificate')),
                        };
                        
                    // create a sslServer variable with https and pass th SSL details in option
                        const sslServer = https.createServer(sslOptions, app);

                    // listen server 
                        sslServer.listen(PORT, () => {
                            console.log(`Server listening at PORT ${PORT}`);
                        });
                } else if (process.env.NODE_ENV === projectEnvironmentTypes.productionEnv) {
                        console.log('PRODUCTION env');
                        /*
                            here we are adding SSL certificate for that we have to to configure some more information 
                            like SSL files 
                            key, ca, cert files 
                        */
                        // ssl server setup 
                            let sslOptions = {
                                rejectUnauthorized: false,
                                key: fs.readFileSync(path.join(process.cwd(), 'SSL_PRIVATE_KEY')),
                                ca: fs.readFileSync(path.join(process.cwd(), 'SSL_CA_FILE')),
                                cert: fs.readFileSync(path.join(process.cwd(),'SSL_certificate')),
                            };
                            
                        // create a sslServer variable with https and pass th SSL details in option
                            const sslServer = https.createServer(sslOptions, app);
    
                        // listen server 
                            sslServer.listen(PORT, () => {
                                console.log(`Server listening at PORT ${PORT}`);
                            });
                    }
        } catch (error) {
            console.log('Server is not running!');
        }
    };

// start the server 
    serverManagement();
