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
DatabaseModel.UNIQUE_VIOLATION = "UNIQUE_VIOLATION";
DatabaseModel.CONSTRAINT_VIOLATED = "CONSTRAINT_VIOLATED";
DatabaseModel.FOREIGN_KEY_VIOLATION = "FOREIGN_KEY_VIOLATION";

module.exports = DatabaseModel;