var pg = require('pg');
var Constants = require('./Constants.js');

//should extend the ActiveRecord class
function UserModel(username, password){
    this.username = username;
    this.password = password;
    this.connection = null;
    this.parser = null;
    var self = this;
    this.signUp = function(callback) { 
        var jsonObject = {};
        
        var inputQuery = "INSERT INTO users (username, hashed_password) VALUES ("+ "\'" + this.username + "\'" + ","+ "\'" + this.password + "\'" +")";
        var testUserQuery = "SELECT * FROM users U WHERE U.username=\'" + this.username + "\'";
        this.connection.query(testUserQuery, function(err, result){
            // return error, user already in database
            var queryResult = self.parser.parseUser(result);
            if(queryResult.length>0){
                jsonObject.errCode = Constants.ERR_USER_EXISTS;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
        });
        this.connection.query(inputQuery, function (err, result) {
            jsonObject.errCode = Constants.SUCCESS;
            var jsonForm = JSON.stringify(jsonObject);
            callback(jsonForm);
            return;
        });// input query
    }// signup END

    this.login = function(callback) {
        var jsonObject = {};
        var testUserQuery = "SELECT * FROM users U WHERE U.username=\'" + this.username + "\'";
        this.connection.query(testUserQuery, function(err, result){
            var queryResult = self.parser.parseUser(result);
            if(queryResult.length>0){
                //CASE: PASSWORD CORRECT
                if(result.rows[0].hashed_password === password) {
                    //CASE: PASSWORD CORRECT
                    //return success
                    jsonObject.errCode = Constants.SUCCESS;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                }
                
            }
            //CASE: USER NOT IN DATABASE OR PASSWORD NOT CORRECT
            jsonObject.errCode = Constants.ERR_INVAL_CRED;
            var jsonForm = JSON.stringify(jsonObject);
            callback(jsonForm);
            return;

        });
    }

    this.setParser = function(parser) {
        this.parser = parser;
    }

    this.getParser = function() {
        return this.parser;
    }
    
    this.setDatabaseModel = function(model) {
        this.connection = model;
    }

    this.setSort = function(sortby) {
    }
    
    this.connect = function(callback) {
        //this.connection = new pg.Client(process.env.DATABASE_URL);
        this.connection.connect();
        callback();
    }
    
    this.end = function(){
        this.connection.end();
    }
}
    //{errCode:SUCCESS} if success
    //{errCode:ERR_USER_EXISTS} if user exists
    //{errcode:ERR_INVAL_CRED} if username exists but password does not match

module.exports = UserModel;













