var ActiveRecord = require('../Models/ActiveRecord.js');
var Constants = require('../Constants.js');

function RecipeRecord(username, recipe_name, dateCreated) {
    ActiveRecord.call(this);
    this.put("username", username);
    this.put("recipe_name", recipe_name);
    this.put("datecreated", dateCreated);
    this.numFields = Constants.HISTORY_NUM_FIELDS;
    this.tableName = Constants.HISTORY_TABLE;
}
RecipeRecord.prototype = Object.create(ActiveRecord.prototype);
RecipeRecord.prototype.constructor = ActiveRecord;

module.exports = RecipeRecord;
