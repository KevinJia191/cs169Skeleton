var pg = require('pg');
/*
var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
*/
var HistoryModel = require('./Recipe.js');

var HistoryController = function(res) {

    this.res = res;

    
    // postRequest is a json containing the fields: user, recipe_name, current_date, rating
    this.make = function(postRequest) {
        console.log("postRequest is" + postRequest);
        var jsonObject = {};     
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date, postRequest.rating);
        historyModel.connect();
        historyModel.make(function (resultingJson) {
            console.log('hi1' + resultingJson);
            historyModel.end();
            res.header('Content-Type', 'application/json');
            res.end(resultingJson);
        });
    }

    // postRequest is a json containing the fields: user
    this.getHistory = function(postRequest) {
        var jsonObject = {};
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date, postRequest.rating);
        historyModel.connect();
        historyModel.getAllHistoryFromUser(function (resultingJson) {
            historyModel.end();
            res.header('Content-Type', 'application/json');
            res.end(resultingJson);
        });
    }
    
    // postRequest is a json containing the fields: user
    this.clearHistory = function(postRequest, callback) {
        var jsonObject = {};
        var historyModel = new HistoryModel(postRequest.user, postRequest.recipe_name, postRequest.current_date, postRequest.rating);
        historyModel.connect();
        historyModel.clearAllHistoryFromUser(function (resultingJson) {
            historyModel.end();
            res.header('Content-Type', 'application/json');
            res.end(resultingJson);
        });
    }
    /*
    this.unitTestSetup = function(){
        db.serialize(function() {
            if(!exists) {
                db.run("Create table users (username text primary key, hashed_password text);");
                db.run("Create table ingredients (username text,ingredient_name text,expiration_date text,quantity decimal check(quantity>0),unit text,primary key(username,ingredient_name,expiration_date));");
                db.run("Create table history (username text references users(username),recipe_name text,dateCreated text,rating int check(rating > 0 AND rating <= 5),primary key(username,recipe_name,dateCreated));");
                            
                db.run("INSERT INTO users values(\"user1\",\"pass1\"");
                db.run("INSERT INTO users values(\"user2\",\"pass2\"");
                db.run("INSERT INTO users values(\"user3\",\"pass3\"");

                db.run("INSERT INTO history values \"user1\",\"Apple Soup\",\"2/2/2\",3");
                db.run("INSERT INTO history values \"user1\",\"Banana Soup\",\"3/3/3\",2");
                db.run("INSERT INTO history values \"user2\",\"Chicken Soup\",\"4/4/4\",4");
                db.run("INSERT INTO history values \"user3\",\"Dough Soup\",\"5/5/5\",5");
                
                db.each("SELECT username, recipe_name, dateCreated, rating FROM history WHERE user =\'"+postRequest.user+"\'", function(err, row) {
                console.log("row is " + row);
                console.log("" + row.username + ", " + row.recipe_name + ", " + row.dateCreated + ", " + row.rating);
                });
            }
        });
        db.close();
    }
    
    var unitTestMake = function(postRequest, callback){
        db.serialize(function() {
            if(!exists) {
                db.run("Create table users (username text primary key, hashed_password text);");
                db.run("Create table ingredients (username text,ingredient_name text,expiration_date text,quantity decimal check(quantity>0),unit text,primary key(username,ingredient_name,expiration_date));");
                db.run("Create table history (username text references users(username),recipe_name text,dateCreated text,rating int check(rating > 0 AND rating <= 5),primary key(username,recipe_name,dateCreated));");
            }
            var stmt = db.prepare("INSERT INTO history VALUES (?)");
            
            stmt.run(postRequest.user, postRequest.recipe_name, postRequest.current_date, postRequest.rating);
            stmt.finalize();
            
        });
        db.close();
        callback();
    }
    
    var unitTestGetHistory = function(postRequest, callback){
        var history = [];
        var users = [];
        var recipe_names = [];
        var date_createds = [];
        var ratings = [];
        db.serialize(function() {
            db.each("SELECT username, recipe_name, dateCreated, rating FROM history WHERE user =\'"+postRequest.user+"\'", function(err, row) {
                console.log("row is " + row);
                console.log("" + row.username + ", " + row.recipe_name + ", " + row.dateCreated + ", " + row.rating);
                users.push(row.user);
                recipe_names.push(row.recipe_name);
                date_createds.push(row.dateCreated);
                ratings.push(row.rating);
            });
        });
        db.close();
        history.push(users);
        history.push(recipe_names);
        history.push(date_createds);
        history.push(ratings);
        callback(history);
    }
    
    var unitTestClearHistory = function(postRequest, callback){
        db.serialize(function() {
            db.run("DELETE FROM HISTORY WHERE username=\' " + postRequest.user + "\'");
        });
        db.close();
        callback();
    }
    */
}


module.exports = HistoryController;