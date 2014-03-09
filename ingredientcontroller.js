var IngredientController = function(request) {

    this.request = request;

    //Take in a Ingredient Object eventually
    function addIngredient(user, ingredient_name, quantity, unit, expiration_date) {
        return {errCode : 1};
    }

    //Take in a Ingredient Object eventually
    function removeIngredient(user, ingredient_name, quantity, unit, expiration_date) {
        return {errCode : 1};
    }

    function removeAll(user) {
        return {errCode : 1};
    }

    function getInventory(user) {
        return {errCode : 1};
    }
}
module.exports = IngredientController;