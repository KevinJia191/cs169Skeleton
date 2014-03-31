var pg = require('pg');
var HistoryModel = require('./Recipe.js');
var PostgreSQLDatabaseModel = require('./PostgreSQLDatabaseModel.js');
var PostgreSQLParser = require('./PostgreSQLParser.js');

var HistoryController = function(res) {

    this.res = res;
    
    
    // postRequest is a json containing the fields: user, recipe_name, current_date, rating
    this.make = function(postRequest) {
        /*
        console.log("postRequest is" + postRequest);
        console.log("postRequest is" + postRequest.user);
        console.log("postRequest is" + postRequest.recipe_name);
        console.log("postRequest is" + postRequest.current_date);
        console.log("postRequest is" + postRequest.rating);
        */

        var jsonObject = {};     
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date, postRequest.rating);
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
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date, postRequest.rating);
        var db = new PostgreSQLDatabaseModel(process.env.DATABASE_URL);
        historyModel.setDatabaseModel(db);
        historyModel.setParser(new PostgreSQLParser());
        db.connect();   
        
        //result will have something if successful
        historyModel.getAllHistoryFromUser(function (err, result) {
            db.end();
            jsonObject.errCode = err;
            if(result != null){
                jsonObject.userHistory = result;
            }
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify(jsonObject));
        });
    }
    
    // postRequest is a json containing the fields: user
    this.clearHistory = function(postRequest, callback) {
        var jsonObject = {};     
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date, postRequest.rating);
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
}


module.exports = HistoryController;