var UserController = function(request) {

    this.request = request;
    // postRequest is a json containing the fields: user, password
    // TODO: encrypt the password
    function signup(postRequest) {
        return {'errCode' : 1};
    }

    // postRequest is a json containing the fields: user, hashed_password
    function login(postRequest) {
        return {'errCode' : 1};
    }
}
module.exports = UserController;
