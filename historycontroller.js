var historycontroller = function(json){

    this.json = json;
    
    //take in a "recipe" object eventually
    function make(user, recipeData){
        return {errCode : 1};
    }
    
    function getHistory(user){
        return {errCode : 1};
    }
    
    function clearHistory(user){
        return {errCode : 1};
    }
}


module.exports = historycontroller;