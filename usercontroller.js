var UserController = function(request) {

    this.request = request;
    // postRequest is a json containing the fields: user, password
    // TODO: encrypt the password
    this.signup = function (postRequest) {
        return {'errCode' : 1};
    }

    // postRequest is a json containing the fields: user, hashed_password
    this.login = function (postRequest) {
        return {'errCode' : 1};
    }
}
module.exports = UserController;
