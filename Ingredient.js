//TODO: Figure out difference between using this.username, self.username, and var username
function Ingredient(username, ingredient_name, expiration_date, quantity, unit){
    //each "History" object represents a row in the history table
    this.username = username;
    this.ingredient_name = ingredient_name;
    this.expiration_date = expiration_date;
    this.quantity = quantity;
    this.unit = unit;
    
    //repeat for all fields
    this.getUsername = function(){
        return this.userName;
    }
    
}