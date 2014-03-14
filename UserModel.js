var pg = require('pg');

//should extend the ActiveRecord class
function UserModel(username, password){
    this.username = username;
    this.password = password
    this.connection = null;
    
    this.signUp = function(postRequest, callback) { 
        var jsonObject = {};
        
        var inputQuery = "INSERT INTO users (username, hashed_password) VALUES ("+ this.username + "," +this.password +")";
        var testUserQuery = "SELECT * FROM users U WHERE U.username=\'" + this.username + "/'";

        this.connection.query(testUserQuery, function(err, result){
            // return error, user already in database
            if(result.rows.length>0){
                jsonObject.errCode = UserModel.ERR_USER_EXISTS;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
            //add user to database
            else{
                this.connection.query(inputQuery, function (err, result) {
                    jsonObject.errCode = UserModel.SUCCESS;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                });
            }// ELSE END
        });//TestUserQuery END
    }// signup END

    this.login = function(postRequest, callback) {
        var jsonObject = {};
        var testUserQuery = "SELECT * FROM users U WHERE U.username=\'" + this.username + "/'";
        
        this.connection.query(testUserQuery, function(err, result){
            if(result.rows.length>0){

                //CASE: PASSWORD NOT CORRECT
                if(result.rows.hashed_password != this.password) {
                    jsonObject.errCode = UserModel.ERR_INVAL_CRED;
                    var jsonForm = JSON.stringify(jsonObject);
                    callback(jsonForm);
                    return;
                }

                //CASE: PASSWORD CORRECT
                //return success
                jsonObject.errCode = UserModel.SUCCESS;
                var jsonForm = JSON.stringify(jsonObject);
                callback(jsonForm);
                return;
            }
            //CASE: USER NOT IN DATABASE
            jsonObject.errCode = UserModel.ERR_INVAL_CRED;
            var jsonForm = JSON.stringify(jsonObject);
            callback(jsonForm);
            return;

        });
    }

    
    this.setDatabaseModel = function(model) {
        this.connection = model;
    }

    this.setSort = function(sortby) {
    }
    
    this.connect = function() {
        console.log("CONNECTION OCCURED");
        this.connection = new pg.Client(process.env.DATABASE_URL);
        this.connection.connect();
    }
    
    this.end = function(){
        this.connection.end();
    }
}
    //{errCode:SUCCESS} if success
    //{errCode:ERR_USER_EXISTS} if user exists
    //{errcode:ERR_INVAL_CRED} if username exists but password does not match
UserModel.SUCCESS = "SUCCESS";
UserModel.ERR_USER_EXISTS = "ERR_USER_EXISTS"
UserModel.ERR_INVAL_CRED = "ERR_INVAL_CRED";

module.exports = UserModel;













