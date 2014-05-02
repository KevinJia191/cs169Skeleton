var RegistrationModel = require('../Models/RegistrationModel.js');
var PostgreSQLDatabaseModel = require('../Models/PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('../Parsers/PostgreSQLParser.js');
var Constants = require('../Constants.js');
var RegistrationController = function(res) {
    this.res = res;
    var self = this;

    this.set = function (req) {
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL)
        var regModel = new RegistrationModel(req.body.user, req.body.reg_id);
        regModel.setDatabaseModel(db);
        regModel.setParser(new PostgreSQLParser());
        db.connect();
        regModel.set(function (err, result) {
	    db.end();
	    self.res.header('Content-Type', 'application/json');
	    var json = {errCode : err};
	    self.res.end(JSON.stringify(json));
	});
    }


    /*
    this.get = function (req) {
	var regModel = new RegistrationModel(postRequest["user"]);
	var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
	regModel.setDatabaseModel(db);
	regModel.setParser(new PostgreSQLParser());
	db.connect();
	ingredientModel.getInventory(function (err, result) {
	    db.end();
	    var json = {errCode : err};
	    var inventory = new Array();
	    for (index = 0; index < result.length; index++) {
		var ingredient = { "ingredient_name":result[index].ingredient_name, "expiration_date":result[index].expiration_date, "quantity": result[index].quantity, "unit":result[index].unit};
		inventory[index] = ingredient;
	    }
	    json["items"] = inventory;
	    res.header('Content-Type', 'application/json');
	    res.end(JSON.stringify(json));
	});
    }
    */
}
module.exports = RegistrationController;