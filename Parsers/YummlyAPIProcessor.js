//YummlyAPIProcessor
var RecipeAPIProcessor = require('./RecipeAPIProcessor.js')
  , inherits     = require('util').inherits
  ;

function YummlyAPIProcessor() {
  RecipeAPIProcessor.call(this);
  this.extended=true;
}

inherits(YummlyAPIProcessor, RecipeAPIProcessor);

YummlyAPIProcessor.prototype.pat = function pat() {
  console.log('purr');
};

YummlyAPIProcessor.prototype.lasagna = function() {
  console.log('lasagna!');
};

YummlyAPIProcessor.prototype.walk = function() {
  console.log('I CAN WALK SO FAST!');
}

YummlyAPIProcessor.prototype.search = function(yummlyResults,callback){
        jsonArray = []
        recArray=[];
        recnameArray=[];
        siuArray=[];
        dArray=[];
        ilArray=[];
        var new_son = "";
        for (var i=0;i<yummlyResults.length;i++) {
            recArray.push(yummlyResults[i].id);
            recnameArray.push(yummlyResults[i].recipeName);
            siuArray.push(yummlyResults[i].smallImageUrls);
            dArray.push(yummlyResults[i].sourceDisplayName);
            ilArray.push(yummlyResults[i].ingredients);
        }
        new_son = {
        recipe_id : recArray, 
        recipe_name: recnameArray, 
        smallImageUrls:siuArray, 
        details: dArray,
        ingredient_list: ilArray
        };
	var format_son = JSON.stringify(new_son);
	callback(format_son);
}

module.exports = YummlyAPIProcessor;