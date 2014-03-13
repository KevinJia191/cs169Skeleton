/*
Searchcontroller Tests
*/
var SearchController = require('../searchcontroller.js');

/*

LOGIC:

We know that the API is dynamic (they could add or remove ingredients)
as a result, we will check for a few things.

1) We will make sure what we query for comes out as a result
2) We will check to make sure that the ERROR Doesn't come up
3) We will keep track of a variable called passed tests.

If Passed Tests == 0; then this means that the API could be down!

*/

exports['chickenSearch'] = function (test) {

	console.log("starting chicken search");
	var s;
	var searchController = new SearchController(null);
    searchController.search("chicken",function(result){
      s = result;
      console.log(s.indexOf("penis"));
    
    });
    test.done();
	
};

exports['calculate2'] = function (test) {
    test.equal(4, 4);
    test.done();
};