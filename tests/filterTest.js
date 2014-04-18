//var SearchController = require('../MockFoodAPI.js');
var SearchController = require('../SearchController.js');
var query;

//TODO: make a test for each possible allowedcourse, just to see if they run
//Note: there is... no way to verify that the tests are returning the -right- results, since its up to Yummly
//Only thing we can verify via unit tests is whether or not we get an error
exports['filterIsRunningTest'] = function (test) {
	query="chicken";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Appetizers";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query) == -1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,"filterIsRunningTest failed");
	  test.done();
    });
};

exports['filterIsActuallyFilteringTest'] = function (test) {
	query="chicken";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Cocktails";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = 1;
      }
      else{
      	result = -1;
      }
	  test.equal(result,1,query+"Fail Filter Test is not Failing right");
	  test.done();
    });
};

exports['mainDishFilterTest'] = function (test) {
	query="chicken";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Main Dishes";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Main Dish filter not returning recipes");
	  test.done();
    });
};

exports['DessertsFilterTest'] = function (test) {
	query="chocolate";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Desserts";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Desserts filter not returning recipes");
	  test.done();
    });
};

exports['SideDishesFilterTest'] = function (test) {
	query="chicken";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Side Dishes";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Side Dishes filter not returning recipes");
	  test.done();
    });
};

exports['LunchandSnacksFilterTest'] = function (test) {
	query="chicken";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Lunch and Snacks";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Lunch and Snacks filter not returning recipes");
	  test.done();
    });
};

exports['SaladsFilterTest'] = function (test) {
	query="chicken";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Salads";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Salads filter not returning recipes");
	  test.done();
    });
};

exports['BreadsFilterTest'] = function (test) {
	query="cheese";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Breads";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Breads filter not returning recipes");
	  test.done();
    });
};

exports['BreakfastandBrunchFilterTest'] = function (test) {
	query="cheese";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Breakfast and Brunch";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Breakfast and Brunch filter not returning recipes");
	  test.done();
    });
};

exports['SoupsFilterTest'] = function (test) {
	query="cheese";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Soups";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Soups filter not returning recipes");
	  test.done();
    });
};

exports['BeveragesFilterTest'] = function (test) {
	query="water";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Beverages";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Beverages filter not returning recipes");
	  test.done();
    });
};

exports['CondimentsandSaucesFilterTest'] = function (test) {
	query="eggs";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Condiments and Sauces";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Condiments and Sauces filter not returning recipes");
	  test.done();
    });
};

exports['CocktailsFilterTest'] = function (test) {
	query="water";
    var postRequest = {};
    postRequest.q = query;
    postRequest.allowedCourse = "course^course-Cocktails";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(postRequest,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+"Cocktails filter not returning recipes");
	  test.done();
    });
};