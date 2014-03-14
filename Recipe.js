var pg = require('pg');
var constantModel = require('./Constants.js');

/*
Model for a "History" element : primary key'd by (username, recipe_name, date_created), to ensure one recipe per day by each user
All callbacks are of the form: function(returningJson)
*/
function Recipe(username, recipe_name, date_created, rating){
    this.username = username;
    this.recipe_name = recipe_name;
    this.current_date = date_created;
    this.rating = rating;
    this.connection = null;
    
    var self = this;
    /*
    Make's this Recipe object and inserts into a user's history table
    */
    this.make = function(callback) {
        var jsonObject = {};     
        
        var testUserQuery = "SELECT * FROM users U WHERE U.username=\'" + this.username + "\'";
        var testAlreadyMadeQuery = "SELECT * FROM history H WHERE H.username=\'" + this.username + "\'" + "AND H.recipe_name=\'" + this.recipe_name + "\'" + "AND H.dateCreated='" + this.current_date +"'";
        var makeQuery = "INSERT INTO HISTORY VALUES('" + this.username + "','" + this.recipe_name + "','" + this.current_date + "'," + this.rating + ")";
        
        console.log(testUserQuery);
        console.log(testAlreadyMadeQuery);
        console.log(makeQuery);
        
        this.connection.query(testUserQuery, function(err, result){
            if(err){
                console.error(err);
                jsonObject.errCode = constantModel.ERROR;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
            console.log("err1 is " + err);
            console.log(result.rows);
            console.log(result.rows.length);
            if(result.rows.length>0){
                console.log("2");
                self.connection.query(testAlreadyMadeQuery, function(err, result){
                    if(err){
                        console.error(err);
                        jsonObject.errCode = constantModel.ERROR;
                        var jsonForm = JSON.stringify(jsonObject);
                        callback(jsonForm);
                        return;
                    }
                    console.log("err2 is " + err);
                    console.log("result is " + result);
                    console.log("3");
                    if(result.rows.length == 0){
                        console.log("Did not fail already made today check");
                        self.connection.query(makeQuery, function(err, result){
                            if(err){
                                console.error(err);
                                jsonObject.errCode = constantModel.ERROR;
                                var jsonForm = JSON.stringify(jsonObject);
                                callback(jsonForm);
                                return;
                            }
                            console.log("WE HAVE A SUCESS");
                            jsonObject.errCode = constantModel.SUCCESS;
                            var jsonForm = JSON.stringify(jsonObject);
                            callback(jsonForm);
                            return;
                        });
                    }
                    else{
                        console.log("ERROR RECIPE CREATED ALREADY");
                        jsonObject.errCode = constantModel.ERR_RECIPE_CREATED_ALREADY;
                        var jsonForm = JSON.stringify(jsonObject);
                        callback(jsonForm);
                        return;
                    }
                });
            }
            else{
                console.log("CURRENT USER NOT FOUND");
                jsonObject.errCode = constantModel.ERR_USER_NOTFOUND;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
        });
    }

    this.clearAllHistoryFromUser = function(callback) {
        var jsonObject = {};
        var deleteQuery = "DELETE FROM HISTORY WHERE username=\' " + this.username + "\'"
        this.connection.query(deleteQuery, function(err, result){
            if(err){
                console.error(err);
                jsonObject.errCode = constantModel.ERROR;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
            
            jsonObject.errCode = constantModel.SUCCESS;
            var jsonForm = JSON.stringify(jsonObject);
            callback(jsonForm);
        });
    }

    this.getAllHistoryFromUser = function(callback){
        var jsonObject = {};
        var testUserQuery = "SELECT * FROM users U WHERE U.username=\'" + this.username + "/'";
        var getHistoryQuery = "SELECT * FROM history H WHERE H.username=\'" + this.username + "\'";
        this.connection.query(testUserQuery, function(err, result){
            if(result.rows.length > 0){
                self.connection.query(getHistoryQuery, function(err, result){
                    if(err){
                        console.error(err);
                        jsonObject.errCode = constantModel.ERROR;
                        var jsonForm = JSON.stringify(jsonObject);
                        callback(jsonForm);
                        return;
                    }
                    jsonObject.userHistory = result.rows;
                    jsonObject.errCode = constantModel.SUCCESS;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                });
            }
            else{
                jsonObject.errCode = constantModel.INVAL_USER;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
        });
    }
    
    this.contains = function(callback) {
    }

    this.setDatabaseModel = function(model) {
        this.connection = model;
    }

    this.setSort = function(sortby) {
    }
    
    this.connect = function() {
        this.connection = new pg.Client(process.env.DATABASE_URL);
        this.connection.connect();
    }
    
    this.end = function(){
        this.connection.end();
    }
}
/*
Recipe.SUCCESS = "SUCCESS";
Recipe.INVAL_USER = "INVAL_USER"
Recipe.ERR_CREATED_ALREADY = "ERR_CREATED_ALREADY";
Recipe.ERROR = "ERROR";
*/
module.exports = Recipe;