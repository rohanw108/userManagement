


// import section 

    class DateCalculation {
        // it will return a date of last n number 
        static getPrevDate = (val) =>  {
            // calculate the one date
                const aDay = 24 * 60 * 60 * 1000;
            // calculate the last n number of date
                const last = new Date().getTime() - val * aDay;
            // return days
            return last;
        }
    }
// export section 
    export default DateCalculation;