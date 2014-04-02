var helperMethods = function() { }

helperMethods.doSetup = function(db, callback) {
    db.connect();
    var createUsers = "Create table users (username text primary key, hashed_password text, salt text);"
    db.query(createUsers, function(err, results) {
	db.query("Create table ingredients (username text references users(username),ingredient_name text,expiration_date text,quantity decimal check(quantity>0),unit text, primary key(username,ingredient_name,expiration_date)); ", function(err, results) {
	    var createHistory = "Create table history (username text references users(username), recipe_name text, dateCreated text, primary key(username,recipe_name,dateCreated));";
	    db.query(createHistory, function(err, results) {
		callback();
	    });
	});
    });
}

helperMethods.setupAndCreateUsers = function(db, callback) {
    helperMethods.doSetup(db, function() {
	db.query("insert into users values('jernchr', 'foo', 'abc')", function(err, results) {
	    db.query("insert into users values('jernchr2', 'foo2', 'd12')", callback);
	});
    });
}

helperMethods.createUser = function(username, password) {
    
}

module.exports = helperMethods;