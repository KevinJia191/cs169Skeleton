var HistoryController = function(request) {

    this.request = request;
    
    // postRequest is a json containing the fields: user, recipe_name, current_date, rating
    this.make = function(postRequest) {
        return {errCode : 1};
    }

    // postRequest is a json containing the fields: user
    this.getHistory = getHistory(postRequest) {
        return {errCode : 1};
    }
    
    // postRequest is a json containing the fields: user
    this.clearHistory = function(postRequest) {
        return {errCode : 1};
    }
}


module.exports = HistoryController;