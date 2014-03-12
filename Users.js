//TODO: Figure out difference between using this.username, self.username, and var username
function User(username, password){
    //each "User" object represents a row in the Users table
    this.username = username;
    this.password = password;
    
    //repeat for all fields
    this.getUsername = function(){
        return this.userName;
    }
    
}