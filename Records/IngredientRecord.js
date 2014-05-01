var ActiveRecord = require('../Models/ActiveRecord.js');
var Constants = require('../Constants.js');
var util = require("util");
function IngredientRecord(username, ingredient_name, expiration_date, quantity, unit) {
    ActiveRecord.call(this);
    this.fields["username"] = username;
    this.fields["ingredient_name"] = ingredient_name;
    this.fields["expiration_date"] = expiration_date;
    this.fields["quantity"] = quantity;
    this.fields["unit"] = unit;
    this.numFields = Constants.INGREDIENTS_NUM_FIELDS;
    this.tableName = Constants.INGREDIENTS_TABLE;
}
IngredientRecord.prototype = Object.create(ActiveRecord.prototype);
IngredientRecord.prototype.constructor = ActiveRecord;
//util.inherits(IngredientRecord, ActiveRecord);

module.exports = IngredientRecord;
