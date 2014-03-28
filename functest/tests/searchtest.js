/*
Searchcontroller Tests
*/
var SearchController = require('../SearchController.js');

/*

LOGIC:

We know that the API is dynamic (they could add or remove ingredients)
as a result, we will check for a few things.

The reason why the api call will contain the search keyword is simple. I am using
extremely popular words that are highly likely to show up at least once!

1) We will make sure what we query for comes out as a result
2) We will check to make sure that the ERROR Doesn't come up
3) We will keep track of a variable called passed tests.

If Passed Tests == 0; then this means that the API could be down!

*/

exports['chickenSearch'] = function (test) {
	query="chicken";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
	  test.done();
    });
};

exports['milkSearch'] = function (test) {
	query="milk";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
	  test.done();
    });
    
};

exports['vegetableSearch'] = function (test) {
	query="vegetable";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
	  test.done();
    });
    
};

exports['pastaSearch'] = function (test) {
	query="pasta";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      console.log(s.indexOf(query));
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
	  test.done();
    });
    
};

exports['italianSearch'] = function (test) {
	query="italian";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      console.log(s.indexOf(query));
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
	  test.done();
    });
    
};

exports['fishSearch'] = function (test) {
	query="fish";
	var result;
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      if(s.indexOf(query)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
	  test.done();
    });
    
};

exports['nameSearch'] = function (test) {
	//My name should not be a valid search that returns some recipie for my name
	//should return no items
	query="akhilnambiar";
	var result;
	var noItemsERROR = 2;
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      if(s.indexOf(noItemsERROR)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
	  test.done();
    });
    
};

exports['nonExistent'] = function (test) {
	query="beef stew";
	var result;
	console.log("starting nonExistent search: search for beef stew and chicken doesn't show up");
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      if(s.indexOf("chicken")==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,-1,"chicken parmesean should not be a result of searching for beef stew!");
	  test.done();
    });  
};

exports['nameSearch2'] = function (test) {
	query="GEORGENECULA";
	var result;
	var noItemsERROR = 2;
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      if(s.indexOf(noItemsERROR)==-1){
      	result = -1;
      }
      else{
      	result = 1;
      }
	  test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
	  test.done();
    });
    
};
/*

For the next 2 tests, the word yummly should be in the api call since the API is from
yummly

*/
exports['isYummlyInJSON'] = function (test) {
  query="chicken";
  var result;
  var noItemsERROR = 2;
  var s;
  var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      if(s.indexOf("yummly")==-1){
        result = -1;
      }
      else{
        result = 1;
      }
    test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
    test.done();
    });
    
};

exports['isYummlyInJSON2'] = function (test) {
  query="beef";
  var result;
  var noItemsERROR = 2;
  var s;
  var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      if(s.indexOf("yummly")==-1){
        result = -1;
      }
      else{
        result = 1;
      }
    test.equal(result,1,query+" DID NOT HAVE THE CORRECT SEARCH API CALL");
    test.done();
    });
    
};

exports['IFALLFAIL'] = function (test) {
	console.log("important note! If all tests fail, could be API Failure");
	test.done();
}

/*
exports['invalidQuery'] = function (test) {
	//SEarch for something that doesn't make sesnes

	query="%5";
	var result;
	console.log("starting nonExistent search: search for beef stew and chicken doesn't show up");
	var s;
	var searchController = new SearchController(null);
    searchController.search(query,function(result){
      s = result;
      console.log(s.indexOf("chicken"));
      if(s.indexOf("chicken")==-1){
      	console.log('item that was searched for not showing in API call');
      	result = -1;
      }
      else{
      	result = 1;
      }
      console.log("result is "+result);
	  test.equal(result,-1,query+"chicken parmesean should not be a result of searching for beef stew!");
	  test.done();
    });  
};
*/