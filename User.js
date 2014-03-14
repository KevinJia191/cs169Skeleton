// should extend the ActiveRecord class.
function User(username, password){
    this.username = username;
    this.password = password;

    this.add = function(callback) {
    }
    
    this.get = function(callback) {
    }
    
    this.remove = function(callback) {
    }
    
    this.contains = function(callback) {
    }

    this.setDatabaseModel = function(model) {
    }
    this.setSort = function(sortby) {
    }
    this.connect = function() {
        this.connection = new pg.Client(process.env.DATABASE_URL);
        this.connection.connect();
    }
    
}