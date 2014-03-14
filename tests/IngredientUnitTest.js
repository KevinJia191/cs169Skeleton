//var sqlite3 = require("sqlite3").verbose();
var SQLite3Model = require('./SQLite3DatabaseModel.js');

exports["testSomething"] = function(test){
    var db = new SQLite3Model();
    db.connect();
    db.query("CREATE TABLE lorem (info TEXT)", function(err, results) {
	console.log(err);
	db.query("INSERT INTO lorem VALUES ('yolo')", function(err, results) {
	    console.log(err);
	    db.query("select * from lorem", function( err, rows) {
		console.log(err);
		console.log(rows);
		db.end();
		test.expect(1);
		test.ok(true, "this assertion should pass");
		test.done();
	    });
	});
    });
};
