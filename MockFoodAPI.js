//MockFoodAPI.js
var RecipeAPIProcessor = require('./RecipeAPIProcessor.js')
  , inherits     = require('util').inherits
  ;

function MockFoodAPI() {
  RecipeAPIProcessor.call(this);
  this.extended=true;
}

inherits(MockFoodAPI, RecipeAPIProcessor);

MockFoodAPI.prototype.pat = function pat() {
  console.log('purr');
};

MockFoodAPI.prototype.lasagna = function() {
  console.log('lasagna!');
};

MockFoodAPI.prototype.walk = function() {
  console.log('I CAN WALK SO FAST!');
}

/*
This function takes in the query only!

>>>@param Query as a string -CHANGED-
@param postRequest is a jsonobject of the form: {q: query, allowedCourseFilters[]: "...."}
@return JSON same style as yummly which will contain 10 elements
*/
MockFoodAPI.prototype.search = function(postRequest,callback){
    var query = postRequest.q;
    jsonArray = [];
    recArray=[];
    recnameArray=[];
    siuArray=[];
    dArray=[];
    ilArray=[];
    var new_son = "";
    var baseURL="www.food.com/"+query
    var baseRecipe=query+"casserole"
    //id is the number of the item
    var baseImageUrl=query+".jpeg"
    var baseSourceDisplayName = "source"
    var baseIngredients = ["ingredient1","ingredient2","ingredient3"]
    for (var i=0;i<10;i++) {
        recArray.push(i);
        recnameArray.push(baseRecipe+i);
        siuArray.push(i+baseImageUrl);
        dArray.push(baseSourceDisplayName+i);
        ilArray.push(baseIngredients);
    }
    new_son = {
    recipe_id : recArray, 
    recipe_name: recnameArray, 
    smallImageUrls:siuArray, 
    details: dArray,
    ingredient_list: ilArray
    };
	var format_son = JSON.stringify(new_son);
  if (callback==null){
    console.log("no callback");
  }
  else {
    callback(format_son);
  }
	return format_son;
}

module.exports = MockFoodAPI;