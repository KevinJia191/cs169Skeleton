var IngredientController = function(request) {

    this.request = request;

    // postRequest is a json containing fields: user, ingredient_name, quantity, unit, expiration_date
    this.addIngredient = function(postRequest) {
        return {errCode : 1};
    }

    // postRequest is a json containing fields: user, ingredient_name, quantity, unit, expiration_date
    this.removeIngredient = function(postRequest) {
        return {errCode : 1};
    }

    // postRequest is a json containing the fields: user
    this.removeAll = function(postRequest) {
        return {errCode : 1};
    }
    // postRequest is a json containing the fields: user
    this.getInventory = function(postRequest) {
        return {errCode : 1};
    }
}
module.exports = IngredientController;