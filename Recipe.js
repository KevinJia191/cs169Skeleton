var pg = require('pg');

//should extend the ActiveRecord class
function Recipe(username, recipe_name, date_created, rating){
    this.username = username;
    this.recipe_name = recipe_name;
    this.date_created = date_created;
    this.rating = rating;
    this.connection = null;
    
    this.make = function(postRequest, callback) {
        var jsonObject = {};     
        
        var testUserQuery = "SELECT * FROM users U WHERE username=\'" + this.username + "/'"
        var testAlreadyMadeQuery = "SELECT * FROM history H WHERE username=\'" + this.username + "\'" + "AND recipe_name=\'" + this.recipe_name + "\'" + "AND current_date=" + this.current_date
        var makeQuery = "INSERT INTO HISTORY VALUES(" + this.username + "," + this.recipe_name + "," + this.current_date + "," + this.rating + ")"
        
        this.connection.query(testUserQuery, function(err, result){
            if(result.rows.length>0){
                this.connection.query(testAlreadyMadeQuery, function(err, result){
                    if(result.rows.length == 0){
                        //Did not fail already made today check
                        this.connection.query(makeQuery, function(err, result){
                            if(err){
                                console.error(err);
                                jsonObject.errCode = Recipe.ERROR;
                                var jsonForm = JSON.stringify(jsonObject);
                                callback(jsonForm);
                                return;
                            }
                            jsonObject.errCode = Recipe.SUCCESS;
                            var madeEntry = "(" + this.username + "," + this.recipe_name + "," + this.current_date + "," + this.rating + ")";
                            jsonObject.madeEntry = madeEntry;
                            var jsonForm = JSON.stringify(jsonObject);
                            callback(jsonForm);
                            return;
                        });
                    }
                    else{
                        jsonObject.errCode = Recipe.ERR_CREATED_ALREADY;
                        var jsonForm = JSON.stringify(jsonObject);
                        callback(jsonForm);
                        return;
                    }
                });
            }
            else{
                jsonObject.errCode = Recipe.INVAL_USER;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
        });
    }

    this.clearAllHistoryFromUser = function(postRequest, callback) {
        var jsonObject = {};
        var deleteQuery = "DELETE FROM HISTORY WHERE username=\' " + this.username + "\'"
        this.connection.query(deleteQuery, function(err, result){
            if(err){
                console.error(err);
                jsonObject.errCode = Recipe.ERROR;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
            
            jsonObject.errCode = Recipe.SUCCESS;
            jsonObject.deletedEntry = "deletedAll";
            var jsonForm = JSON.stringify(jsonObject);
            callback(jsonForm);
        });
    }

    this.getAllHistoryFromUser = function(postRequest, callback){
        var jsonObject = {};
        var testUserQuery = "SELECT * FROM users U WHERE username=\'" + this.username + "/'";
        var getHistoryQuery = "SELECT * FROM history H WHERE username=\'" + this.username + "\'";
        this.connection.query(testUserQuery, function(err, result){
            if(result.rows.length > 0){
                this.connection.query(getHistoryQuery, function(err, result){
                    if(err){
                        console.error(err);
                        jsonObject.errCode = Recipe.ERROR;
                        var jsonForm = JSON.stringify(jsonObject);
                        callback(jsonForm);
                        return;
                    }
                    jsonObject.userHistory = result.rows;
                    jsonObject.errCode = Recipe.SUCCESS;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                });
            }
            else{
                jsonObject.errCode = Recipe.INVAL_USER;
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
Recipe.SUCCESS = "SUCCESS";
Recipe.INVAL_USER = "INVAL_USER"
Recipe.ERR_CREATED_ALREADY = "ERR_CREATED_ALREADY";
Recipe.ERROR = "ERROR";

module.exports = Recipe;