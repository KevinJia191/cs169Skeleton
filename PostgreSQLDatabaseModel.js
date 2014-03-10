//should extend the DatabaseModel class
function PostgreSQLDatabaseModel(dbUrl) {
    /*
     * Start a connection with the db.
     */
    this.connect = function() {
	var connection = new pg.Client(dbUrl);
	connection.connect();
    }
    /*
     * End the connection with the db.
     */
    this.end = function() {
	connection.end();
    }
    
    /*
     * Execute the sql query, and call the callback when the query completes with the parameters err, and result. callback should
     * be defined as callback(err, result);
     */
    this.query  = function(query, callback) {
	connection.query(query, callback);
    }
}