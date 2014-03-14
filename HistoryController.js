var pg = require('pg');
/*
var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
*/
var HistoryModel = require('./Recipe.js');

var HistoryController = function(request, unitTesting) {

    this.request = request;
    var SUCCESS = "SUCCESS";
    var INVAL_USER = "INVAL_USER"
    var ERR_CREATED_ALREADY = "ERR_CREATED_ALREADY";
    var ERROR = "ERROR";
    
    // postRequest is a json containing the fields: user, recipe_name, current_date, rating
    this.make = function(postRequest, callback) {
        var jsonObject = {};     
  
        if(unitTesting){
            unitTestMake(postRequest, function(){
                jsonObject.errCode = SUCCESS;
                jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            });
        } 
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("SELECT * FROM users U WHERE username=\'" + postRequest.user + "/'", function(err, result){
                if(result.rows.length>0){
                    client.query("SELECT * FROM history H WHERE username=\'" + postRequest.user + "\'" + "AND recipe_name=\'" + postRequest.recipe_name + "\'" + "AND current_date=" + postRequest.current_date, function(err, result){
                        if(result.rows.length == 0){
                            //Did not fail already made today check
                            client.query("INSERT INTO HISTORY VALUES(" + postRequest.user + "," + postRequest.recipe_name + "," + postRequest.current_date + "," + postRequest.rating + ")", function(err, result){
                                done();
                                if(err){
                                    console.error(err);
                                    jsonObject.errCode = ERROR;
                                    var jsonForm = JSON.stringify(jsonObject);
                                    callback(jsonForm);
                                    return;
                                }
                                
                                jsonObject.errCode = SUCCESS;
                                
                                var madeEntry = "(" + postRequest.user + "," + postRequest.recipe_name + "," + postRequest.current_date + "," + postRequest.rating + ")";
                                
                                jsonObject.madeEntry = madeEntry;
                                var jsonForm = JSON.stringify(jsonObject);
                                callback(jsonForm);
                                return;
                            });
                        }
                        else{
                            jsonObject.errCode = ERR_CREATED_ALREADY;
                            var jsonForm = JSON.stringify(jsonObject);
                            callback(jsonForm);
                            return;
                        }
                    });
                }
                else{
                    jsonObject.errCode = INVAL_USER;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                }
            });
        });
    }

    // postRequest is a json containing the fields: user
    this.getHistory = function(postRequest, callback) {
        var jsonObject = {};
        if(unitTesting){
            unitTestGetHistory(postRequest, function(history){
                jsonObject.errCode = SUCCESS;
                jsonObject.history = history;
                jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            });
        } 
        var user = postRequest.user;
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("SELECT * FROM users U WHERE username=\'" + postRequest.user + "/'", function(err, result){
                if(result.rows.length > 0){
                    client.query("SELECT * FROM history H WHERE username=\'" + user + "\'", function(err, result){
                        done();
                        if(err){
                            console.error(err);
                            jsonObject.errCode = ERROR;
                            var jsonForm = JSON.stringify(jsonObject);
                            callback(jsonForm);
                            return;
                        }
                        jsonObject.userHistory = result.rows;
                        jsonObject.errCode = SUCCESS;
                        var jsonForm = JSON.stringify(jsonObject);
                        callback(jsonForm);
                        return;
                    });
                }
                else{
                    jsonObject.errCode = INVAL_USER;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                }
            });
        });
    }
    
    // postRequest is a json containing the fields: user
    this.clearHistory = function(postRequest, callback) {
        if(unitTesting){
            unitTestClearHistory(postRequest, function(){
                jsonObject.errCode = SUCCESS;
                jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            });
        } 
        var jsonObject = {};
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query("DELETE FROM HISTORY WHERE username=\' " + postRequest.user + "\'", function(err, result){
                done();
                if(err){
                    console.error(err);
                    jsonObject.errCode = ERROR;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                }
                
                jsonObject.errCode = SUCCESS;
                jsonObject.deletedEntry = "deletedAll";
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
            });
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