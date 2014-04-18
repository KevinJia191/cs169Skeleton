var pg = require('pg');
var HistoryModel = require('./HistoryModel.js');
var RatingModel = require('./RatingModel.js');
var PostgreSQLDatabaseModel = require('./PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('./PostgreSQLParser.js');

var HistoryController = function(res) {

    this.res = res;
    
    
    // postRequest is a json containing the fields: user, recipe_name, current_date
    this.make = function(postRequest) {
        /*
        console.log("postRequest is" + postRequest);
        console.log("postRequest is" + postRequest.user);
        console.log("postRequest is" + postRequest.recipe_name);
        console.log("postRequest is" + postRequest.current_date);
        */

        var jsonObject = {};     
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date);
        var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new PostgreSQLParser());
        db.connect();        
        //result will always be null
        historyModel.make(function (err, result) {
            db.end();
            jsonObject.errCode = err;
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify(jsonObject));
        });
    }

    // postRequest is a json containing the fields: user
    this.getHistory = function(postRequest) {
        var jsonObject = {};     
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date);
        var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new PostgreSQLParser());
        db.connect();   
        
        //result will have something if successful
        historyModel.getAllHistoryFromUser(function (err, result) {
            db.end();
            var json = {errCode : err};
            if(result != null){
		var history = new Array();
		for (index = 0; index < result.length; index++) {
		    var recipe = { "recipe_name":result[index].recipe_name, "date_created": result[index].datecreated};
		    history[index] = recipe;
	    }
	    json["history"] = history;
            }
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify(json));
        });
    }
    
    //postRequest is a json containing the fields: user, recipe_name, curren_date
    //deletes one history item
    this.removeHistoryRecord = function(postRequest) {
        var jsonObject = {};     
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date);
        var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new PostgreSQLParser());
        db.connect();   
        
        historyModel.clearAllHistoryFromUser(function (err, result) {
            db.end();
            jsonObject.errCode = err;
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify(jsonObject));
        });
    }
    
    // postRequest is a json containing the fields: user
    // clears all history items from a user
    this.clearHistory = function(postRequest, callback) {
        var jsonObject = {};     
        //recipe_name and current date will simply be null
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date);
        var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new PostgreSQLParser());
        db.connect();   
        
        historyModel.clearAllHistoryFromUser(function (err, result) {
            db.end();
            jsonObject.errCode = err;
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify(jsonObject));
        });
    }
    
    this.rate = function(postRequest, callback) {
        var jsonObject = {};     
        var ratingModel = new RatingModel(postRequest.user, postRequest.recipe_name, postRequest.rating);
        var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        ratingModel.setDatabaseModel(db);
        ratingModel.setParser(new PostgreSQLParser());
        db.connect();   
        
        ratingModel.rate(function (err, result) {
            db.end();
            jsonObject.errCode = err;
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify(jsonObject));
        });
    }
}


module.exports = HistoryController;