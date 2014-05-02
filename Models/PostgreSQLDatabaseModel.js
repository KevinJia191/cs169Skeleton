var pg = require('pg');
//should extend the DatabaseModel class
function PostgreSQLDatabaseModel(dbUrl) {
    this.dbUrl = dbUrl;
    this.connection = new pg.Client(dbUrl);
    /*
     * Start a connection with the db.
     */
    this.connect = function() {
	this.connection.connect();
    }
    /*
     * End the connection with the db.
     */
    this.end = function() {
	this.connection.end();
    }
    
    /*
     * Execute the sql query, and call the callback when the query completes with the parameters err, and result. callback should
     * be defined as callback(err, result);
     */
    this.query = function(query, callback) {
	this.connection.query(query, callback);
    }
}

module.exports = PostgreSQLDatabaseModel;