var sqlite3 = require("sqlite3").verbose();

function SQLite3DatabaseModel(file) {
    this.file = file;
    this.connection = null;
    if (file == null) {
	this.connection = new sqlite3.Database(':memory:');
    }
    else {
	this.connection = new sqlite3.Database(file);
    }
    /*
     * Start a connection with the db.
     */
    this.connect = function() {
    }
    /*
     * End the connection with the db.
     */
    this.end = function() {
	this.connection.close();
    }
    
    /*
     * Execute the sql query, and call the callback when the query completes with the parameters err, and result. callback should
     * be defined as callback(err, result);
     */
    this.query = function(query, callback) {
	this.connection.all(query,callback);
    }
}

module.exports = SQLite3DatabaseModel;