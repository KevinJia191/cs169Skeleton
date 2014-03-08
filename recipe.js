//TODO: Figure out difference between using this.username, self.username, and var username
function Recipe(username, recipe_name, date_created, rating){
    //each "Recipe" object represents a row in the History table
    this.username = username;
    this.recipe_name = recipe_name;
    this.date_created = date_created;
    this.rating = rating;
    
    //repeat for all fields
    this.getUsername = function(){
        return this.userName;
    }
    
}