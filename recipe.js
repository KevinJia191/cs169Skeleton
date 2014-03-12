//should extend the ActiveRecord class
function Recipe(username, recipe_name, date_created, rating){
    this.username = username;
    this.recipe_name = recipe_name;
    this.date_created = date_created;
    this.rating = rating;
    
    this.add = function(callback) {
    }

    this.remove = function(callback) {
    }

    this.get = function(callback){
    }
    
    this.contains = function(callback) {
    }

    this.setDatabaseModel = function(model) {
    }

    this.setSort = function(sortby) {
    }
}