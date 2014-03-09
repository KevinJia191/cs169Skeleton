var IngredientController = function(request) {

    this.request = request;

    // postRequest is a json containing fields: user, ingredient_name, quantity, unit, expiration_date
    function addIngredient(postRequest) {
        return {errCode : 1};
    }

    // postRequest is a json containing fields: user, ingredient_name, quantity, unit, expiration_date
    function removeIngredient(postRequest) {
        return {errCode : 1};
    }

    // postRequest is a json containing the fields: user
    function removeAll(postRequest) {
        return {errCode : 1};
    }
    // postRequest is a json containing the fields: user
    function getInventory(postRequest) {
        return {errCode : 1};
    }
}
module.exports = IngredientController;