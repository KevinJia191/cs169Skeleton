var HistoryController = function(request) {

    this.request = request;
    
    // postRequest is a json containing the fields: user, recipe_name, current_date, rating
    function make(postRequest) {
        return {errCode : 1};
    }

    // postRequest is a json containing the fields: user
    function getHistory(postRequest) {
        return {errCode : 1};
    }
    
    // postRequest is a json containing the fields: user
    function clearHistory(postRequest) {
        return {errCode : 1};
    }
}


module.exports = HistoryController;