var pg = require('pg');

var UserController = function(request) {

    this.request = request;

    // postRequest is a json containing the fields: user, password
    // TODO: encrypt the password
    //{errCode:SUCCESS} if success
    //{errCode:ERR_USER_EXISTS} if user exists
    //{errCode:ERROR} if name is null or longer than 128 characters
    //will also give back ERROR if cannot connect to database
    this.signup = function (postRequest, callback) {


      //Check to see if name is valid
      var name = postRequest.username;
      if (name == null || name.length > 128) {
         callback(JSON.stringify({errCode:'ERROR'}));
         return;
      }

      pg.connect(process.env.DATABASE_URL, function(err,client,done) {
        //Checking to see if name in database
        console.log(process.env.DATABASE_URL);
        client.query("SELECT * FROM users WHERE username=\'" + name + "\'", function (err,result){
            if (err) {
                callback(JSON.stringify({errCode:'ERR_USER_EXISTS'}));
                return;
            };
            //check to see result
            console.log(result);
        });
        //Adding user to database
        client.query("INSERT INTO users (username, hashed_password) VALUES ("+ postRequest.username + ","+postRequest.password +")", function(err){
            if(err) {
                callback(JSON.stringify({errCode:'ERROR'}));
                return;
            };
            callback(JSON.stringify({errCode:'SUCCESS'}));
            return;
        });

      });


        //return {'errCode' : 1};
    } // end of THIS.SIGNUP

    // postRequest is a json containing the fields: user, hashed_password
    //{errCode:SUCCESS} if login succeeds
    //{errcode:ERR_INVAL_CRED}
    this.login = function (postRequest,callback) {
        return {'errCode' : 1};
    }
}
module.exports = UserController;
