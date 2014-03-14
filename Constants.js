
function Constants(){
}


//ERROR CODES
Constants.SUCCESS = "SUCCESS"; //SUCCESSFUL OPERATION

Constants.ERR_RECIPE_CREATED_ALREADY = "ERR_RECIPE_CREATED_ALREADY";
Constants.ERROR = "ERROR";
Constants.SUCCESS_UPDATED = "SUCCESS_UPDATED"; //Updated an ingredient
Constants.NEGATIVE_QUANTITY = "NEGATIVE_QUANTITY";
Constants.DATE_ERROR = "DATE_ERROR";  
Constants.DOESNT_EXIST = "DOESNT_EXIST";

Constants.ERR_USER_NOTFOUND = "ERR_USER_NOTFOUND"; //Tried to use a username that doens't exist
Constants.ERR_USER_EXISTS = "ERR_USER_EXISTS"; //Tried to Signup a user that doesn't exist
Constants.ERR_INVAL_CRED = "ERR_INVAL_CRED"; //Wrong Username, Password Combination

//URLS
Constants.LOGIN = '/users/login';
Constants.SEARCH = '/recipes/search';
Constants.SIGNUP = '/users/signup';
Constants.INGREDIENTS_ADD = '/ingredients/add';
Constants.INGREDIENTS_REMOVE = '/ingredients/remove';
Constants.INGREDIENTS_REMOVEALL = '/ingredients/removeAll';
Constants.INGREDIENTS_GET = '/ingredients/get';
Constants.INGREDIENTS_CLEARALL = '/ingredients/clearAll';
Constants.GET_RECIPE_DATA = '/recipes/getRecipeData';
Constants.GET_HISTORY = '/recipes/history';
Constants.MAKE_RECIPE = '/recipes/make';
Constants.CLEAR_HISTORY = '/recipes/deleteAllHistory';
Constants.RESET_FIXTURE = '/TESTAPI/resetFixture';

module.exports = Constants;
