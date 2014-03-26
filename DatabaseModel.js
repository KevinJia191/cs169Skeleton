// Abstract class to be extended by SQL database models
function DatabaseModel() {
    /*
     * Start a connection with the db.
     */
    this.connect = function() {
    }
    /*
     * End the connection with the db.
     */
    this.end = function() {
    }
    
    /*
     * Execute the sql query, and call the callback when the query completes
     */
    this.query  = function(query, callback) {
    }
}

DatabaseModel.SUCCESS = null;
DatabaseModel.ERROR = "ERROR";
DatabaseModel.DUPLICATE_KEY = "DUPLICATE_KEY";
DatabaseModel.CONSTRAINT_VIOLATED = "CONSTRAINT_VIOLATED";

module.exports = DatabaseModel;