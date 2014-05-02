var helperMethods = function() { }

helperMethods.doSetup = function(db, callback) {
    db.connect();
    var createUsers = "Create table users (username text primary key, hashed_password text, salt text);"
    db.query(createUsers, function(err, results) {
	db.query("Create table ingredients (username text references users(username),ingredient_name text,expiration_date text,quantity decimal check(quantity>0),unit text,date_added text, notification_sent text,  primary key(username,ingredient_name,expiration_date)); ", function(err, results) {
	    var createHistory = "Create table history (username text references users(username), recipe_name text, datecreated text, primary key(username,recipe_name,datecreated));";
	    db.query(createHistory, function(err, results) {
            //TODO: make recipe_name reference history or recipe or something
            var createRatings = "Create table ratings (username text references users(username), recipe_name, rating int check(rating > 0 AND rating <= 5), primary key(username,recipe_name,rating));";
            db.query(createRatings, function(err, results){
                callback();
            });
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