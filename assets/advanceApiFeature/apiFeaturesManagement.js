// import section 
    import projectConstatVariablesDetails from "../projectConstants/projectConstatVariables.js";
    import DateCalculation from "../projectDatesCalculations/dateCalculation.js";

class ApiFeatureManagement {

    // constructure for getting the  queryObjct and query string
        constructor ( DB_Query, QueryString ) {
            this.DB_Query = DB_Query;
            this.QueryString = QueryString;
        }

    // FILTER FEATURE
        
        filterFeature () {
            // here we are going to remove some unwanted data from query object 
                // in query object there must be a sort and page ( for sorting and paginition functionality )
                // these are not the database table fields 
                // so we neet to remove those from query object 
                // after removeing those we can run the proper mongodb query and get proper result

                    // create array for exclude fileds from req.query 
                        /**
                         *  here the data which we are excluding 
                         * 
                         *      why we are excluding the these fileds? 
                         *          in req.query we are passing these properties 
                         *          so in filter function we are filtering the data using table or collction field name
                         *          and -: these 'sort', 'page', 'limit', 'fields' are not the table fields or collection field
                         *          if we pass these data to mongodb query then our query ( find() ) output will not correct
                         * 
                         *          we are not going to exclude original table fields like schema filed names
                         *              sort: for sort the data (sort feature)
                         *              page: for paginition feature
                         *              limit: for paginition feature
                         *              fields: selects the table fields which you need
                         *       
                         * 
                         */

                        // create a array for excluding the keyword from req.query object
                            const excludeFields = [ 'sort', 'page', 'limit', 'fields', 'filterByDate', 'dateFrom', 'dateTo' ];
                                
                        // create a shalow copy of the query object

                            // here we are creating a new object from req.query
                            // this is one type of method to create a shallow copy 
                            // naw reqQueryObject and QueryString are different object but the data is same

                                const reqQueryObject = { ...this.QueryString };

                            // remove the data from query object which we dont need
                                excludeFields.forEach( queryObjectData => {
                                    // delet the data from query object which we dont need
                                        delete reqQueryObject[queryObjectData];
                                });

                            // advance filter like -> gte, lte, eq, gt, lt 
                            // replace the from gte, lte, eq, gt, lt to $gte, $lte, $eq, $gt, $lt 

                            // replace the data 

                                // convert the object from string format 
                                    let queryStr = JSON.stringify(reqQueryObject);

                                // replace operator from gte, lte, eq, gt, lt to $gte, $lte, $eq, $gt, $lt 
                                    // add $ symbole
                                        queryStr =  queryStr.replace(/\b(gte|gt|lte|lt|eq|ne)\b/g, (matchedElement) => {
                                           return `$${matchedElement}`
                                        });

                            // convert the string with javascript object                              
                                let queryObject = JSON.parse(queryStr);

                            // store the data into DB_Query for next operation
                                this.DB_Query = this.DB_Query.find( queryObject );

                            // return all  output -> return this represent all object
                                // return ' this ' for next operation
                                // in this ' this ' keyword is refers to current object
                                    return this;
        }

    // FILTER FUNCTION ACORDING TO DATE
        filterFunctionAcordionToDate () {
            if (this.QueryString.filterByDate) {
                // get the date number like 1 day 7 day 15 day
                    let dateFrom = this.QueryString.filterByDate;

                // get the 
                    const lastDate = new Date(DateCalculation.getPrevDate(dateFrom)).toISOString();

                // get the cuccrent date 
                    const currentDate = new Date().toISOString();
                    
                // db query 
                     // store the data into DB_Query for next operation
                     this.DB_Query = this.DB_Query.find({
                            $and: [
                                { createdAt: { $gte:  lastDate} },
                                { createdAt: { $lte:  currentDate} }
                            ]
                            
                        });
                      
            }

            if (this.QueryString.dateFrom && this.QueryString.dateTo) {
                // get the data from and to
                    let dateOne = this.QueryString.dateFrom;
                    let dateTwo = this.QueryString.dateTo;

                // convert the sting format to date format
                    const start =  new Date(dateOne);
                    const end = new Date(dateTwo);
                    
                // db query 
                     // store the data into DB_Query for next operation
                     this.DB_Query = this.DB_Query.find({
                            $and: [
                                { createdAt: { $gte: start } },
                                { createdAt: { $lte:  end } }

                            ]
                        });
            }
            // return all  output -> return this represent all object
            return this;
        }

    // SORT FEATURE

        sortFeature () {
            /*
                for multiple sort we have to separate the word from ' ,separated ' to add space there

                in mongodb sort query syantax as below
                    sort(name age)
                and we are getting from req.query string 
                    string01,string02,string03  -> ' ,separated '
                we have to remove the comma from there and add the space
                convert it into this format
                    string01 string02 string03               
            
            
            */    

            // chack the sort property is available in req.query object
                if (this.QueryString.sort) {
                    // remove comma and set space
                        const sortBy = this.QueryString.sort.split(',').join(' ');
                    //  run the database query
                        this.DB_Query = this.DB_Query.sort(sortBy);
                }else{
                    // if the user is not setting the sort property in req.query object 
                    // then we have to use default sort
                    // sorting the data on created date of the object 
                    // here we are going to sort the data by default by using crateddDate
                    // it will return newly created object on top
                        this.DB_Query = this.DB_Query.sort('-createdAt');
                }
                // return all  output -> return this represent all object
                    return this;
        }

    // LIMITINGDATA FEATURE

        limitingSelectFieldsFeature () {
            /*
                limiting fields 
                select the table or collection field which you want  
            */
            // check the fields property in req.query  
                if (this.QueryString.fields) {
                    
                    // select fields 
                        const fields = this.QueryString.fields.split(',').join(' ');
                    // run the query
                        this.DB_Query = this.DB_Query.select(fields);
                } else {
                    // not going to send the ' __v ' property
                    this.DB_Query = this.DB_Query.select('-__v');
                } 
            // return this for next operation 
                return this;  
        }

    // PAGINATION FEATURE 
        paginitionFeature ()  {
            /*
                paginition is an design pattern to divide content into separate pages
            */

            // get the page number and limit from req.query if not present then set it to 1 default
            // if present the convert them into number format 
                const page = this.QueryString.page * 1 || projectConstatVariablesDetails.paginitionDefaultPageNo;
                const limit = this.QueryString.limit * 1 || projectConstatVariablesDetails.paginitionLimit;

            // calculate the skip value 
                const skip = ( page  - 1 ) * limit;

            // set the pagination
                this.DB_Query  =  this.DB_Query .skip(skip).limit(limit);

            // return this for next operation
                return this;
        }
}

// export section
    export default ApiFeatureManagement;